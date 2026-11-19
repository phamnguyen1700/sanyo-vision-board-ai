'use client'

import type { ReactNode } from 'react'

import { JourneyViewport } from './journey-viewport'
import type { ScreenMove } from './use-screen-journey'
import type { JourneyScreenId } from '@/lib/journey-flow'

type JourneyTransitionControllerProps = {
  activeId: JourneyScreenId
  move: ScreenMove | null
  blocked: boolean
  duration?: number
  onSettled: (id: JourneyScreenId) => void
  children: (id: JourneyScreenId) => ReactNode
}

/** Single rendering boundary for all journey-level transitions. */
export function JourneyTransitionController({
  activeId,
  move,
  blocked,
  duration,
  onSettled,
  children,
}: JourneyTransitionControllerProps) {
  return (
    <>
      <JourneyViewport
        activeId={activeId}
        move={move}
        blocked={blocked}
        duration={duration}
        onSettled={onSettled}
      >
        {children}
      </JourneyViewport>
    </>
  )
}
