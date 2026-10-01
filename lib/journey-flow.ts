import { topics, type TopicAnswer } from './vision-topics'
import { identitySchema, type Session } from './vision-session'

export type TopicId = (typeof topics)[number]['id']
export type JourneyScreenId = 'home' | 'identity' | TopicId | 'review' | 'result'
export type SlideDirection = 'down' | 'right' | 'up' | 'left'
export type SceneTransition = SlideDirection | 'expand'

export type JourneyScene = {
  id: JourneyScreenId
  label: string
  topicId?: TopicId
  next?: JourneyScreenId
  transitionToNext?: SceneTransition
}

// Directions describe where the next screen lives, not where the current one exits.
export const journeyScenes: readonly JourneyScene[] = [
  { id: 'home', label: 'Vision Board 2027', next: 'identity', transitionToNext: 'down' },
  { id: 'identity', label: 'Về bạn', next: 'vibe', transitionToNext: 'down' },
  { id: 'vibe', topicId: 'vibe', label: 'Vibe 2027', next: 'relationships', transitionToNext: 'down' },
  { id: 'relationships', topicId: 'relationships', label: 'Mối quan hệ', next: 'learning', transitionToNext: 'right' },
  { id: 'learning', topicId: 'learning', label: 'Kỹ năng', next: 'travel', transitionToNext: 'right' },
  { id: 'travel', topicId: 'travel', label: 'Du lịch', next: 'career', transitionToNext: 'up' },
  { id: 'career', topicId: 'career', label: 'Công việc & học tập', next: 'review', transitionToNext: 'left' },
  { id: 'review', label: 'Xem lại', next: 'result', transitionToNext: 'expand' },
  { id: 'result', label: 'Vision Board của bạn' },
]

export const transitionVectors: Record<SlideDirection, { xPercent: number; yPercent: number }> = {
  down: { xPercent: 0, yPercent: 100 },
  right: { xPercent: 100, yPercent: 0 },
  up: { xPercent: 0, yPercent: -100 },
  left: { xPercent: -100, yPercent: 0 },
}

export function reverseDirection(direction: SlideDirection): SlideDirection {
  return { down: 'up', right: 'left', up: 'down', left: 'right' }[direction] as SlideDirection
}

export function getJourneyRoute(scenes: readonly JourneyScene[]) {
  const route: JourneyScene[] = []
  const visited = new Set<JourneyScreenId>()
  let scene = scenes.find((item) => item.id === 'home')

  if (new Set(scenes.map((item) => item.id)).size !== scenes.length) throw new Error('Journey screen IDs must be unique.')
  while (scene) {
    if (visited.has(scene.id)) throw new Error('Journey config contains a cycle.')
    visited.add(scene.id)
    route.push(scene)
    if (scene.id === 'result') break
    if (!scene.next || !scene.transitionToNext) throw new Error(`Missing transition for ${scene.id}.`)
    if ((scene.transitionToNext === 'expand') !== (scene.id === 'review' && scene.next === 'result')) {
      throw new Error('Review must connect to result with the expand transition.')
    }
    const nextId: JourneyScreenId = scene.next
    scene = scenes.find((item) => item.id === nextId)
  }

  if (route.length !== scenes.length || route.at(-1)?.id !== 'result' || !visited.has('identity') || !visited.has('review')) {
    throw new Error('Journey must connect home, identity, topics, review and result.')
  }
  if (route[1]?.id !== 'identity' || route.at(-2)?.id !== 'review' || route.at(-1)?.next) {
    throw new Error('Identity must follow home, and review must be the final step before result.')
  }
  for (const topic of topics) {
    if (route.filter((item) => item.topicId === topic.id && item.id === topic.id).length !== 1) {
      throw new Error(`Journey must contain one screen for ${topic.id}.`)
    }
  }
  return route
}

export function getResumeScreen(route: readonly JourneyScene[], session: Session): JourneyScreenId {
  const firstMissing = route.findIndex((scene) => scene.id === 'identity'
    ? !identitySchema.safeParse(session.identity).success
    : scene.topicId ? !isTopicAnswerValid(scene.topicId, session.answers[scene.topicId]) : false)
  const requested = session.manifestPhase === 'result' ? 'result' : session.activeScreenId || 'home'
  const requestedIndex = route.findIndex((scene) => scene.id === requested)
  const allowedIndex = firstMissing < 0 ? route.length - 1 : firstMissing
  const restored = route[Math.max(0, Math.min(requestedIndex, allowedIndex))].id
  return restored === 'result' && session.manifestPhase !== 'result' ? 'review' : restored
}

export function isTopicAnswerValid(topicId: TopicId, value: TopicAnswer | undefined) {
  const topic = topics.find((item) => item.id === topicId)!
  if (topic.kind === 'multi') {
    return Array.isArray(value) && value.length >= 3 && value.length <= 5 &&
      new Set(value).size === value.length && value.every((item) => (topic.options as readonly string[]).includes(item))
  }
  if (topic.kind === 'paragraph') return typeof value === 'string' && value.trim().length > 0 && value.length <= 200
  if (topic.kind === 'ticket') {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value) &&
      value.destination?.trim() && value.companion?.trim() && value.highlight?.trim())
  }
  return Array.isArray(value) && value.slice(0, 3).filter((line) => line.trim()).length === 3
}
