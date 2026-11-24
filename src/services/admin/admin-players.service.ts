import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type { AdminPlayerListQuery, AdminPlayerListResponse, AdminPlayerStatsResponse } from '@/types/admin-player.types'

function toQueryString(query: AdminPlayerListQuery = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export const adminPlayersService = {
  stats: async (signal?: AbortSignal) => {
    const response = await apiClient.get<AdminPlayerStatsResponse>(endpoints.adminPlayers.stats, signal ? { signal } : undefined)
    return response.data
  },
  list: async (query?: AdminPlayerListQuery, signal?: AbortSignal) => {
    const response = await apiClient.get<AdminPlayerListResponse>(
      `${endpoints.adminPlayers.list}${toQueryString(query)}`,
      signal ? { signal } : undefined,
    )
    return response.data
  },
}
