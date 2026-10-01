'use client'

import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'

type ManifestRevealProps = {
  originRef: RefObject<HTMLDivElement | null>
  containerRef: RefObject<HTMLElement | null>
  onComplete: () => void
}

export function ManifestReveal({ originRef, containerRef, onComplete }: ManifestRevealProps) {
  const overlay = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = overlay.current
    if (!root) return
    const media = gsap.matchMedia()
    media.add({ reduce: '(prefers-reduced-motion: reduce)', animate: '(prefers-reduced-motion: no-preference)' }, (context) => {
      if (context.conditions?.reduce) {
        onComplete()
        return
      }
      const frame = root.querySelector('.manifest-reveal__surface')
      const bounds = root.getBoundingClientRect()
      const origin = originRef.current
      const rect = origin?.getBoundingClientRect()
      const notes = containerRef.current?.querySelectorAll<HTMLElement>('.review-vision__note')
      gsap.set(frame, {
        left: rect ? rect.left - bounds.left : bounds.width / 2,
        top: rect ? rect.top - bounds.top : bounds.height / 2,
        width: rect?.width || 1,
        height: rect?.height || 1,
        opacity: 0,
      })
      const timeline = gsap.timeline({ onComplete })
      if (origin) timeline.to(origin, { scale: 1.35, opacity: 0, duration: 0.95, ease: 'power2.inOut' }, 0)
      notes?.forEach((note) => {
        const noteBounds = note.getBoundingClientRect()
        timeline.to(note, {
          x: (noteBounds.left + noteBounds.width / 2 - bounds.left - bounds.width / 2) * 0.55,
          y: (noteBounds.top + noteBounds.height / 2 - bounds.top - bounds.height / 2) * 0.35,
          scale: 1.12,
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
        }, 0.05)
      })
      timeline.to(frame, { left: 0, top: 0, width: '100%', height: '100%', opacity: 1, duration: 1.15, ease: 'power3.inOut' }, 0)
    }, root)
    return () => media.revert()
  }, [originRef, containerRef, onComplete])

  return (
    <div ref={overlay} className="manifest-reveal" aria-hidden="true">
      <div className="manifest-reveal__surface" />
    </div>
  )
}
