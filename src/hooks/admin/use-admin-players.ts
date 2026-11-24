'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { adminPlayersService } from '@/services/admin'
import type { AdminPlayerListQuery } from '@/types/admin-player.types'
import { queryKeys } from '@/lib/query/query-keys'

const DEFAULT_PAGE_SIZE = 10

export function useAdminPlayerStats() {
  return useQuery({
    queryKey: queryKeys.admin.players({ type: 'stats' }),
    queryFn: ({ signal }) => adminPlayersService.stats(signal),
  })
}

export function useAdminPlayerList(query: Omit<AdminPlayerListQuery, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.admin.players({ ...query, pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => adminPlayersService.list({
      ...query,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      cursor: pageParam,
    }, signal),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
  })
}
