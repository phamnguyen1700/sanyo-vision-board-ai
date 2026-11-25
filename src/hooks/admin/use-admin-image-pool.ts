'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cmsToast } from '@/components/common/cms-toast'
import { adminImagePoolService } from '@/services/admin'
import { queryKeys } from '@/lib/query/query-keys'

export function useAdminImagePoolStats() {
  return useQuery({
    queryKey: queryKeys.admin.imagePool.stats(),
    queryFn: ({ signal }) => adminImagePoolService.getStats(signal),
  })
}

export function useAdminImagePoolFillStatus() {
  return useQuery({
    queryKey: queryKeys.admin.imagePool.fillStatus(),
    queryFn: ({ signal }) => adminImagePoolService.getFillStatus(signal),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'running' || status === 'stopping' ? 1500 : false
    },
    refetchOnMount: 'always',
  })
}

export function useAdminImagePoolFillSummary(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.imagePool.fillSummary(),
    queryFn: ({ signal }) => adminImagePoolService.getFillSummary(signal),
    enabled,
  })
}

export function useStartAdminImagePoolFill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => adminImagePoolService.startFill(),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.admin.imagePool.fillStatus(), data)
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.fillStatus() })
    },
    onError: cmsToast.apiError,
  })
}

export function useStopAdminImagePoolFill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => adminImagePoolService.stopFill(),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.admin.imagePool.fillStatus(), data)
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.fillStatus() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.fillSummary() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.stats() })
    },
    onError: cmsToast.apiError,
  })
}

export function useResumeAdminImagePoolFill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (runId: string) => adminImagePoolService.resumeFill(runId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.admin.imagePool.fillStatus(), data)
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.fillStatus() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.fillSummary() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.stats() })
    },
    onError: cmsToast.apiError,
  })
}
