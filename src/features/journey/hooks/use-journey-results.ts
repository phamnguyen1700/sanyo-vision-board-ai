'use client'

import { useMemo } from 'react'

import type { TopicId } from '@/lib/journey-flow'
import type { TopicAnswer } from '@/lib/vision-topics'

export type JourneyResult = {
  topicId: TopicId
  answer?: TopicAnswer
}

const journeyTopicIds: readonly TopicId[] = ['vibe', 'career', 'relationships', 'travel', 'learning']

/**
 * Exposes the temporary five-question result in the same order as the journey.
 * The session remains the source of truth and persists the draft in sessionStorage.
 */
export function useJourneyResults(answers?: Record<string, TopicAnswer>) {
  return useMemo<readonly JourneyResult[]>(
    () => journeyTopicIds.map((topicId) => ({ topicId, answer: answers?.[topicId] })),
    [answers],
  )
}
