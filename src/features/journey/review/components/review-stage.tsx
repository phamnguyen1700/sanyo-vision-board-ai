'use client'

import type { RefObject } from 'react'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import type { JourneyScene, TopicId } from '@/lib/journey-flow'
import type { Session } from '@/lib/vision-session'
import type { ManifestPhase } from '@/lib/vision-topics'
import { ReviewVision } from './review-vision'
import type { JourneyResult } from '../../hooks/use-journey-results'

type ReviewStageProps = {
  session: Session
  results: readonly JourneyResult[]
  scenes: readonly JourneyScene[]
  phase: ManifestPhase
  canManifest: boolean
  onManifest: () => void
  onEdit: (id: TopicId) => void
  centerRef?: RefObject<HTMLDivElement | null>
}

export function ReviewStage({ session, results, scenes, phase, canManifest, onManifest, onEdit, centerRef }: ReviewStageProps) {
  const stageRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const notes = Array.from(stage.querySelectorAll<HTMLElement>('.review-vision__note'))
    const center = stage.querySelector<HTMLElement>('.review-vision__center')
    const media = gsap.matchMedia()

    media.add({ reduce: '(prefers-reduced-motion: reduce)', animate: '(prefers-reduced-motion: no-preference)' }, (context) => {
      gsap.killTweensOf([...notes, center].filter(Boolean))

      if (phase !== 'transitioning') {
        gsap.set(notes, { x: 0, y: 0, scale: 1, opacity: 1 })
        if (center) gsap.set(center, { scale: 1, opacity: 1 })
        return
      }

      if (context.conditions?.reduce) return

      const bounds = stage.getBoundingClientRect()
      const centerX = bounds.left + bounds.width / 2
      const centerY = bounds.top + bounds.height / 2
      const timeline = gsap.timeline()

      notes.forEach((note, index) => {
        const rect = note.getBoundingClientRect()
        const directionX = rect.left + rect.width / 2 < centerX ? -1 : 1
        const directionY = rect.top + rect.height / 2 < centerY ? -1 : 1
        timeline.to(note, {
          x: directionX * (46 + index * 8),
          y: directionY * (34 + index * 6),
          scale: 0.92,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.in',
        }, 0)
      })

      if (center) {
        timeline.to(center, { opacity: 0, scale: 0.96, duration: 0.55, ease: 'power2.in' }, 0.05)
      }
    }, stage)

    return () => media.revert()
  }, [phase])

  return (
    <section ref={stageRef} className="journey-finale" data-finale-phase={phase} aria-label="Vision Board 2027">
      <div className="journey-screen__scroll">
        <ReviewVision centerRef={centerRef} results={results} scenes={scenes} manifestPhase={phase} canManifest={canManifest} onManifest={onManifest} onEdit={onEdit} />
      </div>
    </section>
  )
}
