'use client'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cmsToast } from '@/components/common/cms-toast'

import { adminQuestionsService } from '@/services/admin'
import type {
  AdminQuestionListQuery,
  CreateAdminQuestionAnswerInput,
  UpdateAdminQuestionAnswerInput,
  UpdateAdminQuestionInput,
} from '@/types/admin-question.types'
import { queryKeys } from '@/lib/query/query-keys'

const DEFAULT_PAGE_SIZE = 5

export function useAdminQuestions(query: Omit<AdminQuestionListQuery, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.admin.questions({ ...query, pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => adminQuestionsService.list({
      ...query,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      cursor: pageParam,
    }, signal),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
  })
}

function invalidateQuestions(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.admin.questions() })
}

export function useUpdateAdminQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ questionId, body }: { questionId: string; body: UpdateAdminQuestionInput }) =>
      adminQuestionsService.update(questionId, body),
    onSuccess: () => {
      cmsToast.success('Đã cập nhật câu hỏi')
      return invalidateQuestions(queryClient)
    },
    onError: cmsToast.apiError,
  })
}

export function useCreateAdminQuestionAnswer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ questionId, body }: { questionId: string; body: CreateAdminQuestionAnswerInput }) =>
      adminQuestionsService.createAnswer(questionId, body),
    onSuccess: () => {
      cmsToast.success('Đã thêm câu trả lời')
      return invalidateQuestions(queryClient)
    },
    onError: cmsToast.apiError,
  })
}

export function useUpdateAdminQuestionAnswer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      questionId,
      answerId,
      body,
    }: {
      questionId: string
      answerId: string
      body: UpdateAdminQuestionAnswerInput
    }) => adminQuestionsService.updateAnswer(questionId, answerId, body),
    onSuccess: () => {
      cmsToast.success('Đã cập nhật câu trả lời')
      return invalidateQuestions(queryClient)
    },
    onError: cmsToast.apiError,
  })
}

export function useDeleteAdminQuestionAnswer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ questionId, answerId }: { questionId: string; answerId: string }) =>
      adminQuestionsService.deleteAnswer(questionId, answerId),
    onSuccess: () => {
      cmsToast.success('Đã xóa câu trả lời')
      return invalidateQuestions(queryClient)
    },
    onError: cmsToast.apiError,
  })
}
