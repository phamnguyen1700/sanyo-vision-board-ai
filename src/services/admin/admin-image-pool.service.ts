import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type {
  PoolFillRunResponse,
  PoolFillSummaryResponse,
  PoolImageStatsResponse,
} from '@/types/admin-image-pool.types'

export const adminImagePoolService = {
  getStats: async (signal?: AbortSignal) => {
    const response = await apiClient.get<PoolImageStatsResponse>(
      endpoints.imagePool.stats,
      signal ? { signal } : undefined,
    )
    return response.data
  },
  startFill: async () => {
    const response = await apiClient.post<PoolFillRunResponse>(endpoints.imagePool.fillStart, {})
    return response.data
  },
  stopFill: async () => {
    const response = await apiClient.post<PoolFillRunResponse>(endpoints.imagePool.fillStop)
    return response.data
  },
  getFillStatus: async (signal?: AbortSignal) => {
    const response = await apiClient.get<PoolFillRunResponse | null>(
      endpoints.imagePool.fillStatus,
      signal ? { signal } : undefined,
    )
    return response.data
  },
  getFillSummary: async (signal?: AbortSignal) => {
    const response = await apiClient.get<PoolFillSummaryResponse>(
      endpoints.imagePool.fillSummary,
      signal ? { signal } : undefined,
    )
    return response.data
  },
}
