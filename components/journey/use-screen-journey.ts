'use client'

import { useCallback, useRef, useState } from 'react'
import type { JourneyScreenId, SlideDirection } from '@/lib/journey-flow'

export type ScreenMove = {
  from: JourneyScreenId
  to: JourneyScreenId
  direction: SlideDirection
}

export function useScreenJourney() {
  const [activeId, setActiveId] = useState<JourneyScreenId>('home')
  const [move, setMove] = useState<ScreenMove | null>(null)
  const current = useRef<JourneyScreenId>('home')
  const locked = useRef(false)

  const goTo = useCallback((to: JourneyScreenId, direction: SlideDirection) => {
    if (locked.current || current.current === to) return false
    locked.current = true
    setMove({ from: current.current, to, direction })
    return true
  }, [])

  const settle = useCallback((id: JourneyScreenId) => {
    current.current = id
    setActiveId(id)
    setMove(null)
    locked.current = false
  }, [])

  return { activeId, move, goTo, settle, isTransitioning: move !== null }
}
