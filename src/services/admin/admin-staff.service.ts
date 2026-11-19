import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type {
  AdminStaffListQuery,
  AdminStaffListResponse,
  CreateAdminStaffInput,
  HardDeleteAdminStaffInput,
  AdminStaffRecord,
  UpdateAdminStaffInput,
} from '@/types/admin-staff.types'

function toQueryString(query: AdminStaffListQuery = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export const adminStaffService = {
  create: async (body: CreateAdminStaffInput) => {
    const response = await apiClient.post<AdminStaffRecord>(endpoints.staff.create, body)
    return response.data
  },
  list: async (query?: AdminStaffListQuery, signal?: AbortSignal) => {
    const response = await apiClient.get<AdminStaffListResponse>(
      `${endpoints.staff.list}${toQueryString(query)}`,
      signal ? { signal } : undefined,
    )
    return response.data
  },
  detail: async (staffId: string, signal?: AbortSignal) => {
    const response = await apiClient.get<AdminStaffRecord>(
      endpoints.staff.detail(staffId),
      signal ? { signal } : undefined,
    )
    return response.data
  },
  update: async (staffId: string, body: UpdateAdminStaffInput) => {
    const response = await apiClient.patch<AdminStaffRecord>(endpoints.staff.update(staffId), body)
    return response.data
  },
  hardDelete: async (staffId: string, body: HardDeleteAdminStaffInput) => {
    await apiClient.delete(endpoints.staff.delete(staffId), { data: body })
  },
}
