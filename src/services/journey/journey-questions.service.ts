import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type { JourneyQuestionsResponse } from '@/types/journey-question.types'

export const journeyQuestionsService = {
  list: async (signal?: AbortSignal) => {
    const response = await apiClient.get<JourneyQuestionsResponse>(
      endpoints.journey.questions,
      signal ? { signal } : undefined,
    )
    return response.data
  },
}
