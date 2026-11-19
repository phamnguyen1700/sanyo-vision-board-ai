import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type { AdminStatsResponse } from '@/types/admin-staff.types'

export const adminStatsService = {
  get: async (signal?: AbortSignal) => {
    const response = await apiClient.get<AdminStatsResponse>(
      endpoints.adminStats,
      signal ? { signal } : undefined,
    )
    return response.data
  },
}
