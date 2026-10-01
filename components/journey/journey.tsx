'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { HeroSection } from '@/components/journey/hero-section'
import { IdentityForm, type IdentityFormHandle } from '@/components/journey/identity-form'
import { ReviewStage } from '@/components/journey/review-stage'
import { TopicSection } from '@/components/journey/topic-section'
import { JourneyViewport } from './journey-viewport'
import { useScreenJourney } from './use-screen-journey'
import { useJourneyGestures } from './use-journey-gestures'
import { createEmptySession, identitySchema, readSession, saveSession, type Identity, type Session } from '@/lib/vision-session'
import { highlightedVibe, type ManifestPhase, type TopicAnswer, topics } from '@/lib/vision-topics'
import { getJourneyRoute, getResumeScreen, isTopicAnswerValid, journeyScenes, reverseDirection, type JourneyScene, type JourneyScreenId, type TopicId } from '@/lib/journey-flow'

type JourneyProps = {
  scenes?: readonly JourneyScene[]
  transitionDuration?: number
  enableGestures?: boolean
  resultImageSrc?: string
}

const emptyIdentity: Identity = { name: '', gender: '', age: '' }

export function Journey({ scenes = journeyScenes, transitionDuration = 0.8, enableGestures = true, resultImageSrc = '/vision-board-final-demo.png' }: JourneyProps) {
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
  const { activeId, move, goTo, settle, isTransitioning } = useScreenJourney()
  const activeScene = route.find((scene) => scene.id === activeId)!
  const busy = isTransitioning || manifestPhase === 'loading' || manifestPhase === 'transitioning'
  const complete = Boolean(session && identitySchema.safeParse(session.identity).success &&
    topicScenes.every((scene) => isTopicAnswerValid(scene.topicId!, session.answers[scene.topicId!])))

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const saved = readSession()
    const initial = saved || createEmptySession(emptyIdentity)
    setSession(initial)
    const restored = getResumeScreen(route, initial)
    settle(restored === 'result' ? 'review' : restored)
    setEditing(initial.editingTopicId === restored)
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

  const next = () => {
    if (busy || !session || !activeScene.next || activeScene.transitionToNext === 'expand') return
    if (activeId === 'identity') {
      identityRef.current?.submit()
      return
    }
    if (activeScene.topicId && !isTopicAnswerValid(activeScene.topicId, session.answers[activeScene.topicId])) return
    if (editing) {
      if (goTo('review', 'left')) setEditing(false)
    } else {
      goTo(activeScene.next, activeScene.transitionToNext || 'down')
    }
  }

  const previous = () => {
    if (busy || activeId === 'result') return
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
    setManifestPhase('transitioning')
  }

  const revealComplete = useCallback(() => {
    setSession((current) => current ? { ...current, manifestPhase: 'result' } : current)
    setManifestPhase('result')
    manifestLock.current = false
  }, [])

  const replay = () => {
    if (busy || !goTo('home', 'down')) return
    setEditing(false)
    restarting.current = true
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
    return (
      <>
        {id !== 'home' && id !== 'result' && (
          <nav className="journey-screen__nav" aria-label="Hành trình">
            <button className="journey-back" type="button" onClick={previous} aria-label={editing || manifestPhase === 'result' ? 'Trở về xem lại' : 'Quay lại'} title={editing || manifestPhase === 'result' ? 'Trở về xem lại' : 'Quay lại'}>
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <span>{id === 'review' && manifestPhase === 'result' ? 'Vision Board của bạn' : scene.label}</span>
            <span className="journey-screen__count">{index >= 0 ? `${index + 1} / ${topicScenes.length}` : ''}</span>
          </nav>
        )}
        {id === 'review' && session ? (
          <ReviewStage session={session} scenes={topicScenes} phase={manifestPhase} designSrc={resultImageSrc} canManifest={complete} onManifest={manifest} onRevealed={revealComplete} onEdit={edit} onReplay={replay} />
        ) : <div className="journey-screen__scroll">
          {id === 'home' && <HeroSection onStart={next} direction={scene.transitionToNext} />}
          {id === 'identity' && <IdentityForm ref={identityRef} defaultValues={session?.identity || emptyIdentity} onDraftChange={updateIdentity} onSubmit={submitIdentity} direction={scene.transitionToNext} />}
          {topic && <TopicSection topic={topic} index={index} value={session?.answers[topic.id] || ''} onChange={(value) => updateAnswer(topic.id, value)} onContinue={next} direction={editing ? 'left' : scene.transitionToNext} editing={editing} />}
        </div>}
      </>
    )
  }

  return (
    <main ref={root} className="journey journey--screens" data-active-screen={activeId} data-manifest-phase={manifestPhase}>
      <JourneyViewport activeId={activeId} move={move} blocked={!session || manifestPhase === 'loading' || manifestPhase === 'transitioning'} duration={transitionDuration} onSettled={handleSettled}>
        {renderScreen}
      </JourneyViewport>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{manifestPhase === 'result' ? 'Vision Board của bạn đã sẵn sàng' : activeScene.label}</span>
    </main>
  )
}
