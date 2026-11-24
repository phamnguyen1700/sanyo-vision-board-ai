'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query/query-keys'
import { playerService } from '@/services/journey'
import type { PlayerCustomImageGenerateRequest, PlayerManifestRequest } from '@/types/player.types'

export function useManifestPlayer() {
  return useMutation({
    mutationFn: (payload: PlayerManifestRequest) => playerService.manifest(payload),
  })
}

export function usePlayerResult(playerId?: string) {
  return useQuery({
    queryKey: queryKeys.journey.player(playerId || 'empty'),
    queryFn: ({ signal }) => playerService.get(playerId!, signal),
    enabled: Boolean(playerId),
  })
}

export function useGeneratePlayerImage() {
  return useMutation({
    mutationFn: ({ playerId, ...payload }: PlayerCustomImageGenerateRequest & { playerId: string }) =>
      playerService.generateImage(playerId, payload),
  })
}
