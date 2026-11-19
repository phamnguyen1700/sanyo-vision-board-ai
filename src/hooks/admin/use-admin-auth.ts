'use client'

import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminAuthService } from '@/services/admin'
import { useAdminAuthStore } from '@/stores/admin-auth.store'
import type { AdminLoginRequest } from '@/types/auth.types'

import { queryKeys } from '@/lib/query/query-keys'

export function useAdminSession() {
  const setAccount = useAdminAuthStore((state) => state.setAccount)
  const clearAccount = useAdminAuthStore((state) => state.clearAccount)

  const query = useQuery({
    queryKey: queryKeys.admin.session(),
    queryFn: ({ signal }) => adminAuthService.me(signal),
    retry: false,
  })

  useEffect(() => {
    if (query.data?.admin) setAccount(query.data.admin)
    if (query.error) clearAccount()
  }, [clearAccount, query.data, query.error, setAccount])

  return query
}

export function useAdminLogin() {
  const queryClient = useQueryClient()
  const setAccount = useAdminAuthStore((state) => state.setAccount)

  return useMutation({
    mutationFn: (body: AdminLoginRequest) => adminAuthService.login(body),
    onSuccess: async (response) => {
      setAccount(response.admin)
      queryClient.setQueryData(queryKeys.admin.session(), response)
    },
  })
}

export function useAdminLogout() {
  const queryClient = useQueryClient()
  const clearAccount = useAdminAuthStore((state) => state.clearAccount)

  return useMutation({
    mutationFn: () => adminAuthService.logout(),
    onSettled: () => {
      clearAccount()
      queryClient.removeQueries({ queryKey: queryKeys.admin.all })
    },
  })
}
