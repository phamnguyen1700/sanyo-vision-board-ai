import axios from 'axios'
import { env } from '@/config/env.config'
import { endpoints } from '@/config/endpoints.config'
import { useAdminAuthStore } from '@/stores/admin-auth.store'
import { queryClient } from '@/lib/query/query-client'
import { queryKeys } from '@/lib/query/query-keys'

import { normalizeApiError } from './errors'
import { ADMIN_SESSION_EXPIRED_EVENT } from './admin-auth-events'
import { cmsToast } from '@/components/common/cms-toast'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  config.withCredentials = true
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error)
    const status = normalizedError instanceof Error && 'status' in normalizedError
      ? Number((normalizedError as { status?: number }).status)
      : 0

    const requestUrl = axios.isAxiosError(error) ? error.config?.url : undefined
    const isLoginRequest = requestUrl?.endsWith(endpoints.adminAuth.login) ?? false

    if (status === 401 && !isLoginRequest) {
      const hadAuthenticatedAccount = Boolean(useAdminAuthStore.getState().account)
      useAdminAuthStore.getState().clearAccount()
      queryClient.removeQueries({
        queryKey: queryKeys.admin.all,
        predicate: (query) => query.queryKey[2] !== 'session',
      })

      if (hadAuthenticatedAccount && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(ADMIN_SESSION_EXPIRED_EVENT, {
          detail: { message: normalizedError.message || 'Phiên đăng nhập đã hết hạn.' },
        }))
      }
    }

    if (status >= 500 || status === 429) {
      cmsToast.server(normalizedError.message || 'Máy chủ đang gặp sự cố.')
    }

    return Promise.reject(normalizedError)
  },
)
