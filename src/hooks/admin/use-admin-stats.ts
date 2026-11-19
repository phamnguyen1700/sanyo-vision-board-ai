'use client'

import { useQuery } from '@tanstack/react-query'

import { adminStatsService } from '@/services/admin'
import { queryKeys } from '@/lib/query/query-keys'

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: ({ signal }) => adminStatsService.get(signal),
  })
}
