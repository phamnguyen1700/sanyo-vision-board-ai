'use client'

import { useEffect, useRef, type RefObject } from 'react'

type GestureOptions = {
  root: RefObject<HTMLElement | null>
  enabled: boolean
  blocked: boolean
  onNext: () => void
  onPrevious: () => void
}

// Native scrolling inside a screen takes priority. A fresh gesture at its edge can navigate.
export function useJourneyGestures({ root, enabled, blocked, onNext, onPrevious }: GestureOptions) {
  const latest = useRef({ blocked, onNext, onPrevious })
  useEffect(() => { latest.current = { blocked, onNext, onPrevious } }, [blocked, onNext, onPrevious])

  useEffect(() => {
    const element = root.current
    if (!element || !enabled) return
    let accumulated = 0
    let lastWheel = 0
    let gesture: 'idle' | 'scrolling' | 'navigated' = 'idle'
    let touch: { x: number; y: number; start: EventTarget | null; top: boolean; bottom: boolean } | null = null

    const ignore = (target: EventTarget | null) => target instanceof Element &&
      Boolean(target.closest('input, textarea, select, button, a, [contenteditable="true"], [data-no-journey-gesture]'))
    const scrollArea = () => element.querySelector<HTMLElement>('.journey-screen:not([aria-hidden="true"]) .journey-screen__scroll')
    const atEdge = (area: HTMLElement, forward: boolean) => forward
      ? area.scrollHeight - area.clientHeight - area.scrollTop <= 2
      : area.scrollTop <= 2
    const navigate = (forward: boolean) => {
      if (latest.current.blocked) return
      if (forward) latest.current.onNext()
      else latest.current.onPrevious()
    }

    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || ignore(event.target)) return
      const now = performance.now()
      if (now - lastWheel > 220) { accumulated = 0; gesture = 'idle' }
      lastWheel = now
      if (latest.current.blocked || gesture === 'navigated') { event.preventDefault(); gesture = 'navigated'; return }
      if (gesture === 'scrolling') return
      const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1)
      if (!delta) return
      const area = scrollArea()
      if (area && !atEdge(area, delta > 0)) { gesture = 'scrolling'; return }
      event.preventDefault()
      if (Math.sign(accumulated) !== Math.sign(delta)) accumulated = 0
      accumulated += delta
      if (Math.abs(accumulated) >= 65) { gesture = 'navigated'; navigate(delta > 0) }
    }
    const touchStart = (event: TouchEvent) => {
      const area = scrollArea()
      if (!area || event.touches.length !== 1 || ignore(event.target)) { touch = null; return }
      touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, start: event.target, top: atEdge(area, false), bottom: atEdge(area, true) }
    }
    const touchEnd = (event: TouchEvent) => {
      if (!touch || event.changedTouches.length !== 1) return
      const dx = touch.x - event.changedTouches[0].clientX
      const dy = touch.y - event.changedTouches[0].clientY
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy
      if (Math.abs(delta) >= 70 && (delta > 0 ? touch.bottom : touch.top)) navigate(delta > 0)
      touch = null
    }
    const cancelTouch = () => { touch = null }
    element.addEventListener('wheel', wheel, { passive: false })
    element.addEventListener('touchstart', touchStart, { passive: true })
    element.addEventListener('touchend', touchEnd, { passive: true })
    element.addEventListener('touchcancel', cancelTouch)
    return () => {
      element.removeEventListener('wheel', wheel)
      element.removeEventListener('touchstart', touchStart)
      element.removeEventListener('touchend', touchEnd)
      element.removeEventListener('touchcancel', cancelTouch)
    }
  }, [root, enabled])
}
