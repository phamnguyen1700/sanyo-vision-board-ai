import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type { PlayerCustomImageGenerateRequest, PlayerImageResponse, PlayerManifestRequest, PlayerResponse } from '@/types/player.types'

export const playerService = {
  manifest: async (payload: PlayerManifestRequest) => {
    const response = await apiClient.post<PlayerResponse>(endpoints.players.manifest, payload)
    return response.data
  },
  get: async (playerId: string, signal?: AbortSignal) => {
    const response = await apiClient.get<PlayerResponse>(
      endpoints.players.detail(playerId),
      signal ? { signal } : undefined,
    )
    return response.data
  },
  generateImage: async (playerId: string, payload: PlayerCustomImageGenerateRequest) => {
    const response = await apiClient.post<PlayerImageResponse>(
      endpoints.players.generateImage(playerId),
      payload,
    )
    return response.data
  },
}
