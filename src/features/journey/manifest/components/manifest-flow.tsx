'use client'

import type { RefObject } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import { ReviewStage } from '../../review'
import { ResultBoard } from '../../result'
import type { JourneyScene, TopicId } from '@/lib/journey-flow'
import type { Session } from '@/lib/vision-session'
import type { ManifestPhase } from '@/lib/vision-topics'
import type { JourneyResult } from '../../hooks/use-journey-results'
import type { PlayerImageGenerationStatus, PlayerResponse } from '@/types/player.types'

type ManifestFlowProps = {
  session: Session
  results: readonly JourneyResult[]
  scenes: readonly JourneyScene[]
  phase: ManifestPhase
  canManifest: boolean
  onManifest: () => void
  onEdit: (id: TopicId) => void
  onReplay: () => void
  onBackToReview: () => void
  onTransitionComplete: () => void
  player: PlayerResponse | null
  imageStatusByQuestionCode: Readonly<Record<string, PlayerImageGenerationStatus>>
}

export function ManifestFlow({
  session,
  results,
  scenes,
  phase,
  canManifest,
  onManifest,
  onEdit,
  onReplay,
  onBackToReview,
  onTransitionComplete,
  player,
  imageStatusByQuestionCode,
}: ManifestFlowProps) {
  const reviewRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const [imageSlotsVisible, setImageSlotsVisible] = useState(phase === 'result')

  useLayoutEffect(() => {
    const review = reviewRef.current
    const result = resultRef.current
    if (!review || !result) return

    const image = result.querySelector<HTMLElement>('.vision-result__image')
    const actions = result.querySelector<HTMLElement>('.vision-result__actions')
    const media = gsap.matchMedia()

    media.add({ reduce: '(prefers-reduced-motion: reduce)', animate: '(prefers-reduced-motion: no-preference)' }, (context) => {
      gsap.killTweensOf([review, result, image, actions])

      if (phase === 'result' || context.conditions?.reduce) {
        setImageSlotsVisible(true)
        gsap.set(review, { opacity: 0, pointerEvents: 'none' })
        gsap.set(result, { opacity: 1, pointerEvents: 'auto' })
        if (image) gsap.set(image, { scale: 1, transformOrigin: '48.55% 32.3%' })
        if (actions) gsap.set(actions, { opacity: 1, y: 0 })
        return
      }

      gsap.set(review, { opacity: 1, pointerEvents: 'auto' })
      gsap.set(result, { opacity: 0, pointerEvents: 'none' })
      setImageSlotsVisible(false)
      if (image) gsap.set(image, { scale: 2.25, transformOrigin: '48.55% 32.3%' })
      if (actions) gsap.set(actions, { opacity: 0, y: 14 })

      if (phase !== 'transitioning') return

      const timeline = gsap.timeline()
      timeline.to(review, { opacity: 0, duration: 0.55, ease: 'power1.inOut' }, 0.65)
        .to(result, { opacity: 1, pointerEvents: 'auto', duration: 0.55, ease: 'power1.inOut' }, 0.65)
        .to(image, { scale: 1, duration: 1.1, ease: 'power3.inOut' }, 1.2)
        .to(actions, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 2.25)
        .call(() => {
          setImageSlotsVisible(true)
          onTransitionComplete()
        }, [], 2.6)
    }, result)

    return () => media.revert()
  }, [phase, onTransitionComplete])

  return (
    <div className="manifest-flow">
      <div ref={reviewRef} className="manifest-flow__layer manifest-flow__layer--review">
        <ReviewStage
          session={session}
          results={results}
          scenes={scenes}
          phase={phase}
          canManifest={canManifest}
          onManifest={onManifest}
          onEdit={onEdit}
        />
      </div>
      <div ref={resultRef} className="manifest-flow__layer manifest-flow__layer--result">
        <ResultBoard
          session={session}
          results={results}
          onReplay={onReplay}
          onBackToReview={onBackToReview}
          player={player}
          imageStatusByQuestionCode={imageStatusByQuestionCode}
          imageSlotsVisible={imageSlotsVisible}
        />
      </div>
    </div>
  )
}
