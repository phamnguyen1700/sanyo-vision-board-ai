import { endpoints } from '@/config/endpoints.config'
import { apiClient } from '@/lib/api/client'
import type {
  AdminQuestion,
  AdminQuestionListQuery,
  AdminQuestionListResponse,
  CreateAdminQuestionAnswerInput,
  UpdateAdminQuestionAnswerInput,
  UpdateAdminQuestionInput,
  PresignAdminQuestionImageInput,
  PresignAdminQuestionImageResponse,
} from '@/types/admin-question.types'

function toQueryString(query: AdminQuestionListQuery = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export const adminQuestionsService = {
  list: async (query?: AdminQuestionListQuery, signal?: AbortSignal) => {
    const response = await apiClient.get<AdminQuestionListResponse>(
      `${endpoints.questions.list}${toQueryString(query)}`,
      signal ? { signal } : undefined,
    )
    return response.data
  },
  detail: async (questionId: string, signal?: AbortSignal) => {
    const response = await apiClient.get<AdminQuestion>(
      endpoints.questions.detail(questionId),
      signal ? { signal } : undefined,
    )
    return response.data
  },
  update: async (questionId: string, body: UpdateAdminQuestionInput) => {
    const response = await apiClient.patch<AdminQuestion>(
      endpoints.questions.update(questionId),
      body,
    )
    return response.data
  },
  createAnswer: async (questionId: string, body: CreateAdminQuestionAnswerInput) => {
    const response = await apiClient.post<AdminQuestion['answers'][number]>(
      endpoints.questions.answers(questionId),
      body,
    )
    return response.data
  },
  updateAnswer: async (
    questionId: string,
    answerId: string,
    body: UpdateAdminQuestionAnswerInput,
  ) => {
    const response = await apiClient.patch<AdminQuestion['answers'][number]>(
      endpoints.questions.answer(questionId, answerId),
      body,
    )
    return response.data
  },
  deleteAnswer: async (questionId: string, answerId: string) => {
    await apiClient.delete(endpoints.questions.answer(questionId, answerId))
  },
  presignAnswerImage: async (
    questionId: string,
    answerId: string,
    body: PresignAdminQuestionImageInput,
  ) => {
    const response = await apiClient.post<PresignAdminQuestionImageResponse>(
      endpoints.questions.presignImage(questionId, answerId),
      body,
    )
    return response.data
  },
  uploadToR2: async (presigned: PresignAdminQuestionImageResponse, file: File) => {
    const response = await fetch(presigned.uploadUrl, {
      method: presigned.method,
      headers: presigned.headers,
      body: file,
    })

    if (!response.ok) throw new Error('Không thể tải ảnh lên kho lưu trữ.')
  },
}
