'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { HeroSection } from './home'
import { IdentityForm, type IdentityFormHandle } from './info'
import { CareerQuestion, LearningQuestion, RelationshipsQuestion, TravelQuestion, VibeQuestion } from './questions'
import { ManifestFlow } from './manifest'
import { useJourneyResults } from './hooks'
import { JourneyTransitionController, useJourneyGestures, useScreenJourney } from './shared'
import { useGeneratePlayerImage, useJourneyQuestions, useManifestPlayer, usePlayerResult } from '@/hooks/journey'
import { createEmptySession, identitySchema, readSession, saveSession, type Identity, type Session } from '@/lib/vision-session'
import { highlightedVibe, type ManifestPhase, type TopicAnswer, topics } from '@/lib/vision-topics'
import { getJourneyRoute, getResumeScreen, isTopicAnswerValid, journeyScenes, reverseDirection, type JourneyScene, type JourneyScreenId, type TopicId } from '@/lib/journey-flow'
import type { PlayerImageGenerationStatus, PlayerManifestRequest, PlayerResponse } from '@/types/player.types'

type JourneyProps = {
  scenes?: readonly JourneyScene[]
  transitionDuration?: number
  enableGestures?: boolean
}

const emptyIdentity: Identity = {
  name: '',
  gender: '',
  phone: '',
  privacyConsent: false,
  marketingConsent: false,
  dataUsageConsent: false,
}
export function Journey({ scenes = journeyScenes, transitionDuration = 0.8, enableGestures = true }: JourneyProps) {
  const route = useMemo(() => getJourneyRoute(scenes), [scenes])
  const topicScenes = useMemo(() => route.filter((scene) => scene.topicId), [route])
  const root = useRef<HTMLElement>(null)
  const identityRef = useRef<IdentityFormHandle>(null)
  const manifestLock = useRef(false)
  const initialized = useRef(false)
  const restarting = useRef(false)
  const [session, setSession] = useState<Session | null>(null)
  const [editing, setEditing] = useState(false)
  const [manifestPhase, setManifestPhase] = useState<ManifestPhase>('idle')
  const [manifestResult, setManifestResult] = useState<PlayerResponse | null>(null)
  const journeyQuestionsQuery = useJourneyQuestions()
  const manifestPlayer = useManifestPlayer()
  const generatePlayerImage = useGeneratePlayerImage()
  const playerResultQuery = usePlayerResult(session?.playerId)
  const [customImageStatuses, setCustomImageStatuses] = useState<Record<string, PlayerImageGenerationStatus>>({})
  const { activeId, move, goTo, settle, isTransitioning } = useScreenJourney()
  const activeScene = route.find((scene) => scene.id === activeId)!
  const busy = isTransitioning || manifestPhase === 'loading' || manifestPhase === 'transitioning'
  const journeyQuestions = journeyQuestionsQuery.data
  const orderedQuestions = useMemo(
    () => [...(journeyQuestions?.items ?? [])].sort((left, right) => left.sortOrder - right.sortOrder),
    [journeyQuestions],
  )
  const journeyResults = useJourneyResults(session?.answers, orderedQuestions)
  const complete = Boolean(session && identitySchema.safeParse(session.identity).success &&
    topicScenes.every((scene) => {
      const index = topicScenes.findIndex((item) => item.id === scene.id)
      return isTopicAnswerValid(scene.topicId!, session.answers[scene.topicId!]) && Boolean(orderedQuestions[index])
    }))

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const saved = readSession()
    const initial = saved || createEmptySession(emptyIdentity)
    setSession(initial)
    const restored = getResumeScreen(route, initial)
    const restoredScreen = restored === 'result' ? 'review' : restored
    settle(restoredScreen)
    setEditing(initial.editingTopicId === restoredScreen)
    setManifestPhase(restored === 'result' ? 'result' : 'idle')
  }, [route, settle])

  useEffect(() => {
    if (session) saveSession({ ...session, activeScreenId: activeId, editingTopicId: editing ? activeScene.topicId : undefined })
  }, [session, activeId, editing, activeScene.topicId])

  const handleSettled = useCallback((id: JourneyScreenId) => {
    if (id === 'home' && restarting.current) {
      setSession(createEmptySession(emptyIdentity))
      setManifestPhase('idle')
      restarting.current = false
    }
    settle(id)
  }, [settle])

  const updateIdentity = useCallback((identity: Identity) => {
    setSession((current) => current ? { ...current, identity, manifestPhase: undefined } : current)
  }, [])

  const updateAnswer = (id: TopicId, value: TopicAnswer) => {
    setSession((current) => current ? {
      ...current,
      answers: { ...current.answers, [id]: value },
      vibe: id === 'vibe' ? highlightedVibe(value) : current.vibe,
      manifestPhase: undefined,
    } : current)
  }

  const next = (answerOverride?: TopicAnswer) => {
    if (busy || !session || !activeScene.next || activeScene.transitionToNext === 'expand') return
    if (activeId === 'identity') {
      identityRef.current?.submit()
      return
    }
    if (activeScene.topicId && !isTopicAnswerValid(activeScene.topicId, answerOverride ?? session.answers[activeScene.topicId])) return
    if (editing) {
      if (goTo('review', 'left')) setEditing(false)
    } else {
      goTo(activeScene.next, activeScene.transitionToNext || 'down')
    }
  }

  const previous = () => {
    if (busy) return
    if (manifestPhase === 'result') {
      setManifestPhase('idle')
      setSession((current) => current ? { ...current, manifestPhase: undefined } : current)
      return
    }
    if (editing) {
      if (goTo('review', 'left')) setEditing(false)
      return
    }
    const prior = route[route.findIndex((scene) => scene.id === activeId) - 1]
    if (prior && prior.transitionToNext && prior.transitionToNext !== 'expand') goTo(prior.id, reverseDirection(prior.transitionToNext))
  }

  const edit = (id: TopicId) => {
    if (busy) return
    if (goTo(id, 'right')) setEditing(true)
  }

  const submitIdentity = (identity: Identity) => {
    if (busy || !activeScene.next || activeScene.transitionToNext === 'expand') return
    updateIdentity(identity)
    goTo(activeScene.next, activeScene.transitionToNext || 'down')
  }

  const manifest = () => {
    if (busy || manifestLock.current || !complete) return
    manifestLock.current = true
    if (!session) {
      manifestLock.current = false
      return
    }

    const questionCodeByTopic = Object.fromEntries(
      topicScenes.map((scene, index) => [scene.topicId, orderedQuestions[index]?.code]),
    ) as Partial<Record<TopicId, string | undefined>>
    const answers: PlayerManifestRequest['answers'] = topicScenes.map((scene) => {
      const answer = session.answers[scene.topicId!]
      const questionCode = questionCodeByTopic[scene.topicId!]
      const question = orderedQuestions.find((item) => item.code === questionCode)
      const values = typeof answer === 'string'
        ? (answer ? [answer] : [])
        : Array.isArray(answer)
          ? answer
          : [answer?.destination].filter((value): value is string => Boolean(value))
      const matchedAnswers = values.map((value) => question?.answers.find(
        (candidate) => candidate.value === value || candidate.content === value,
      ))
      const customText = values.find((_, index) => !matchedAnswers[index])
      const mappedValues = values.map((value, index) => matchedAnswers[index]?.value ?? value)
      return questionCode ? {
        questionCode,
        values: mappedValues,
        ...(customText ? { customText } : {}),
      } : null
    }).filter((item): item is NonNullable<typeof item> => item !== null)

    setManifestPhase('loading')
    manifestPlayer.mutate({
      name: session.identity.name,
      gender: session.identity.gender,
      phone: session.identity.phone,
      marketingConsent: session.identity.marketingConsent,
      dataUsageConsent: session.identity.dataUsageConsent,
      answers,
    }, {
      onSuccess: (player) => {
        setManifestResult(player)
        setSession((current) => current ? { ...current, playerId: player.id } : current)
        const pending = player.answers.filter((answer) => (
          Boolean(answer.customText) && !player.images.some((image) => image.questionCode === answer.questionCode)
        ))
        setCustomImageStatuses(Object.fromEntries(pending.map((answer) => [answer.questionCode, 'loading'])))
        void Promise.allSettled(pending.map(async (answer) => {
          try {
            const image = await generatePlayerImage.mutateAsync({
              playerId: player.id,
              questionCode: answer.questionCode,
            })
            setManifestResult((current) => current ? {
              ...current,
              images: [...current.images.filter((item) => item.questionCode !== image.questionCode), image],
            } : current)
            setCustomImageStatuses((current) => ({ ...current, [answer.questionCode]: 'loaded' }))
          } catch {
            setCustomImageStatuses((current) => ({ ...current, [answer.questionCode]: 'error' }))
          }
        }))
        setManifestPhase('transitioning')
      },
      onError: () => {
        manifestLock.current = false
        setManifestPhase('error')
      },
    })
  }

  const revealComplete = useCallback(() => {
    setSession((current) => current ? { ...current, manifestPhase: 'result' } : current)
    setManifestPhase('result')
    manifestLock.current = false
  }, [])

  const replay = () => {
    if (busy || !goTo('home', 'down')) return
    setEditing(false)
    setManifestPhase('idle')
    setManifestResult(null)
    restarting.current = true
  }

  const backToReview = () => {
    if (busy) return
    setManifestPhase('idle')
    setSession((current) => current ? { ...current, manifestPhase: undefined } : current)
  }

  useJourneyGestures({
    root,
    enabled: enableGestures && manifestPhase !== 'result',
    blocked: busy || !session,
    onNext: next,
    onPrevious: previous,
  })

  const renderScreen = (id: JourneyScreenId) => {
    const scene = route.find((item) => item.id === id)!
    const topic = topics.find((item) => item.id === scene.topicId)
    const index = topicScenes.findIndex((item) => item.id === id)
    const question = index >= 0 ? orderedQuestions[index] : undefined
    return (
      <>
        {id === 'review' && session ? (
          <div className="journey-screen__scroll">
            <ManifestFlow
              session={session}
              results={journeyResults}
              scenes={topicScenes}
              phase={manifestPhase}
              canManifest={complete}
              onManifest={manifest}
              onEdit={edit}
              onReplay={replay}
              onBackToReview={backToReview}
              onTransitionComplete={revealComplete}
              player={manifestResult ?? playerResultQuery.data ?? null}
            imageStatusByQuestionCode={customImageStatuses}
            />
          </div>
        ) : <div className="journey-screen__scroll">
          {id === 'home' && <HeroSection onStart={next} direction={scene.transitionToNext} />}
          {id === 'identity' && <IdentityForm ref={identityRef} defaultValues={session?.identity || emptyIdentity} onDraftChange={updateIdentity} onSubmit={submitIdentity} direction={scene.transitionToNext} />}
          {topic && question && (() => {
            const questionProps = {
              topic,
              index,
              question,
              value: session?.answers[topic.id] || '',
              onChange: (value: TopicAnswer) => updateAnswer(topic.id, value),
              onContinue: next,
              onBack: previous,
              direction: editing ? 'left' : scene.transitionToNext,
              editing,
            }

            switch (topic.id) {
              case 'vibe': return <VibeQuestion {...questionProps} />
              case 'relationships': return <RelationshipsQuestion {...questionProps} />
              case 'learning': return <LearningQuestion {...questionProps} />
              case 'travel': return <TravelQuestion {...questionProps} />
              case 'career': return <CareerQuestion {...questionProps} />
            }
          })()}
          {topic && !question && (
            <p className="journey-question-state" role="alert">
              {journeyQuestionsQuery.isError ? 'Không thể tải dữ liệu câu hỏi.' : 'Câu hỏi chưa được cấu hình.'}
            </p>
          )}
        </div>}
      </>
    )
  }

  return (
    <main ref={root} className="journey journey--screens" data-active-screen={activeId} data-manifest-phase={manifestPhase}>
      <JourneyTransitionController
        activeId={activeId}
        move={move}
        blocked={!session || manifestPhase === 'loading' || manifestPhase === 'transitioning'}
        duration={transitionDuration}
        onSettled={handleSettled}
      >
        {renderScreen}
      </JourneyTransitionController>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{manifestPhase === 'result' ? 'Vision Board của bạn đã sẵn sàng' : activeScene.label}</span>
    </main>
  )
}
