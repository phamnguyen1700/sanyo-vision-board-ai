'use client'

import { useQuery } from '@tanstack/react-query'

import { journeyQuestionsService } from '@/services/journey'
import { queryKeys } from '@/lib/query/query-keys'

export function useJourneyQuestions() {
  return useQuery({
    queryKey: queryKeys.journey.questions(),
    queryFn: ({ signal }) => journeyQuestionsService.list(signal),
  })
}
