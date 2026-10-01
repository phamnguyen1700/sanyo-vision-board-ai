import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Expand } from 'lucide-react'
import type { SceneTransition } from '@/lib/journey-flow'

export function DirectionIcon({ direction = 'down', size = 18 }: { direction?: SceneTransition; size?: number }) {
  const Icon = { down: ArrowDown, right: ArrowRight, up: ArrowUp, left: ArrowLeft, expand: Expand }[direction]
  return <Icon size={size} aria-hidden="true" />
}
