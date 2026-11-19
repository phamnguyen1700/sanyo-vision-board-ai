'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

import { transitionVectors, type JourneyScreenId } from '@/lib/journey-flow'
import type { ScreenMove } from './use-screen-journey'

type JourneyViewportProps = {
  activeId: JourneyScreenId
  move: ScreenMove | null
  blocked: boolean
  duration?: number
  onSettled: (id: JourneyScreenId) => void
  children: (id: JourneyScreenId) => ReactNode
}

export function JourneyViewport({ activeId, move, blocked, duration = 0.8, onSettled, children }: JourneyViewportProps) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    if (!move) {
      const frame = element.querySelector<HTMLElement>('[data-scene]')
      if (!blocked) frame?.focus({ preventScroll: true })
      return
    }

    const outgoing = element.querySelector<HTMLElement>(`[data-scene="${move.from}"]`)
    const incoming = element.querySelector<HTMLElement>(`[data-scene="${move.to}"]`)
    if (!outgoing || !incoming) return

    const media = gsap.matchMedia()
    media.add({ reduce: '(prefers-reduced-motion: reduce)', animate: '(prefers-reduced-motion: no-preference)' }, (context) => {
      if (context.conditions?.reduce) {
        onSettled(move.to)
        return
      }
      const vector = transitionVectors[move.direction]
      gsap.set(incoming, { ...vector, visibility: 'visible' })
      gsap.timeline({ defaults: { duration, ease: 'power3.inOut' }, onComplete: () => onSettled(move.to) })
        .to(outgoing, { xPercent: -vector.xPercent, yPercent: -vector.yPercent }, 0)
        .to(incoming, { xPercent: 0, yPercent: 0 }, 0)
    }, element)
    return () => media.revert()
  }, [move, activeId, duration, onSettled, blocked])

  const ids = move ? [move.from, move.to] : [activeId]
  return (
    <div ref={root} className="journey-viewport" data-transition={move?.direction} aria-busy={Boolean(move) || blocked}>
      {ids.map((id) => (
        <section
          key={id}
          data-scene={id}
          className={`journey-screen ${move?.to === id ? 'journey-screen--incoming' : ''}`}
          role="region"
          aria-label={id === 'home' ? 'SANYO Vision Board 2027' : undefined}
          aria-hidden={move ? true : undefined}
          inert={Boolean(move) || blocked}
          tabIndex={-1}
        >
          {children(id)}
        </section>
      ))}
    </div>
  )
}
