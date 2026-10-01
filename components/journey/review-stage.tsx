'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import type { JourneyScene, TopicId } from '@/lib/journey-flow'
import type { Session } from '@/lib/vision-session'
import type { ManifestPhase } from '@/lib/vision-topics'
import { ManifestReveal } from './manifest-reveal'
import { ResultBoard } from './result-board'
import { ReviewVision } from './review-vision'

type ReviewStageProps = {
  session: Session
  scenes: readonly JourneyScene[]
  phase: ManifestPhase
  designSrc: string
  canManifest: boolean
  onManifest: () => void
  onRevealed: () => void
  onEdit: (id: TopicId) => void
  onReplay: () => void
}

export function ReviewStage({ session, scenes, phase, designSrc, canManifest, onManifest, onRevealed, onEdit, onReplay }: ReviewStageProps) {
  const stage = useRef<HTMLElement>(null)
  const center = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Warm the asset cache without rendering the final design in Review.
    const image = new Image()
    image.src = designSrc
  }, [designSrc])

  useLayoutEffect(() => {
    if (phase === 'result' && scroll.current) scroll.current.scrollTop = 0
  }, [phase])

  return (
    <section ref={stage} className="journey-finale" data-finale-phase={phase} aria-label="Vision Board 2027">
      <div ref={scroll} className="journey-screen__scroll">
        {phase === 'result' ? (
          <ResultBoard session={session} designSrc={designSrc} onReplay={onReplay} />
        ) : (
          <ReviewVision centerRef={center} answers={session.answers} scenes={scenes} manifestPhase={phase} canManifest={canManifest} onManifest={onManifest} onEdit={onEdit} />
        )}
      </div>
      {phase === 'transitioning' && <ManifestReveal originRef={center} containerRef={stage} onComplete={onRevealed} />}
    </section>
  )
}
