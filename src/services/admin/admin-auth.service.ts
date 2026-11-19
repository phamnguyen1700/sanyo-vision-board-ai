import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type { AdminAuthResponse, AdminLoginRequest } from '@/types/auth.types'

export const adminAuthService = {
  login: async (body: AdminLoginRequest) => {
    const response = await apiClient.post<AdminAuthResponse>(endpoints.adminAuth.login, body)
    return response.data
  },
  logout: async () => {
    await apiClient.post(endpoints.adminAuth.logout)
  },
  me: async (signal?: AbortSignal) => {
    const response = await apiClient.get<AdminAuthResponse>(
      endpoints.adminAuth.me,
      signal ? { signal } : undefined,
    )
    return response.data
  },
}
