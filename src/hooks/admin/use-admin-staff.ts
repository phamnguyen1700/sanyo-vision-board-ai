'use client'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminStaffService } from '@/services/admin'
import type {
  AdminStaffListQuery,
  CreateAdminStaffInput,
  HardDeleteAdminStaffInput,
  UpdateAdminStaffInput,
} from '@/types/admin-staff.types'

import { queryKeys } from '@/lib/query/query-keys'
import { cmsToast } from '@/components/common/cms-toast'

const DEFAULT_PAGE_SIZE = 10

export function useAdminStaffList(query: Omit<AdminStaffListQuery, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.admin.staff({ ...query, pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => adminStaffService.list({
      ...query,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      cursor: pageParam,
    }, signal),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
  })
}

export function useAdminStaff(staffId: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.staff({ detail: staffId }),
    queryFn: ({ signal }) => adminStaffService.detail(staffId as string, signal),
    enabled: Boolean(staffId),
  })
}

function invalidateStaffQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.staff() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() }),
  ])
}

export function useCreateAdminStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateAdminStaffInput) => adminStaffService.create(body),
    onSuccess: () => {
      cmsToast.success('Đã tạo tài khoản quản trị viên')
      return invalidateStaffQueries(queryClient)
    },
    onError: cmsToast.apiError,
  })
}

export function useUpdateAdminStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ staffId, body }: { staffId: string; body: UpdateAdminStaffInput }) =>
      adminStaffService.update(staffId, body),
    onSuccess: () => {
      cmsToast.success('Đã cập nhật trạng thái tài khoản')
      return invalidateStaffQueries(queryClient)
    },
    onError: cmsToast.apiError,
  })
}

export function useHardDeleteAdminStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ staffId, body }: { staffId: string; body: HardDeleteAdminStaffInput }) =>
      adminStaffService.hardDelete(staffId, body),
    onSuccess: () => {
      cmsToast.success('Đã xóa vĩnh viễn tài khoản')
      return invalidateStaffQueries(queryClient)
    },
    onError: cmsToast.apiError,
  })
}
