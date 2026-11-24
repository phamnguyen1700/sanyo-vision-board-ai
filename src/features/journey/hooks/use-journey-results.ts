'use client'

import { useMemo } from 'react'

import type { TopicId } from '@/lib/journey-flow'
import type { TopicAnswer } from '@/lib/vision-topics'
import type { JourneyQuestion } from '@/types/journey-question.types'

export type JourneyResult = {
  topicId: TopicId
  answer?: TopicAnswer
}

const journeyTopicIds: readonly TopicId[] = ['vibe', 'career', 'relationships', 'travel', 'learning']

/**
 * Exposes the temporary five-question result in the same order as the journey.
 * The session remains the source of truth and persists the draft in sessionStorage.
 */
export function useJourneyResults(
  answers?: Record<string, TopicAnswer>,
  questions: readonly JourneyQuestion[] = [],
) {
  const questionsByTopic = useMemo(
    () => new Map(journeyTopicIds.map((topicId, index) => [topicId, questions[index]])),
    [questions],
  )

  const resolveValue = (value: string, question?: JourneyQuestion) =>
    question?.answers.find((answer) => answer.value === value)?.content ?? value

  const resolveAnswer = (answer: TopicAnswer | undefined, question?: JourneyQuestion): TopicAnswer | undefined => {
    if (typeof answer === 'string') return resolveValue(answer, question)
    if (Array.isArray(answer)) return answer.map((value) => resolveValue(value, question))
    if (!answer) return undefined
    return {
      ...answer,
      destination: resolveValue(answer.destination, question),
    }
  }

  return useMemo<readonly JourneyResult[]>(
    () => journeyTopicIds.map((topicId) => ({
      topicId,
      answer: resolveAnswer(answers?.[topicId], questionsByTopic.get(topicId)),
    })),
    [answers, questionsByTopic],
  )
}
