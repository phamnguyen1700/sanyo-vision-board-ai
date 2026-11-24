export type AdminQuestionType = 'frame_selection' | 'single_choice'

export interface AdminQuestionAnswer {
  id: string
  questionId: string
  code: string
  content: string
  value: string
  promptHint: string | null
  imageUrl: string | null
  imageKey: string | null
  sortOrder: number
}

export interface AdminQuestion {
  id: string
  code: string
  content: string
  type: AdminQuestionType
  sortOrder: number
  allowCustomAnswer: boolean
  answers: AdminQuestionAnswer[]
}

export interface AdminQuestionListQuery {
  pageSize?: number
  cursor?: string
}

export interface AdminQuestionListResponse {
  items: AdminQuestion[]
  nextCursor: string | null
  hasMore: boolean
  pageSize: number
}

export interface UpdateAdminQuestionInput {
  content?: string
  allowCustomAnswer?: boolean
}

export interface CreateAdminQuestionAnswerInput {
  code: string
  content: string
  value: string
  promptHint?: string | null
  imageUrl?: string | null
  sortOrder: number
}

export interface UpdateAdminQuestionAnswerInput {
  content?: string
  value?: string
  promptHint?: string | null
  imageUrl?: string | null
  imageKey?: string | null
  sortOrder?: number
}

export interface PresignAdminQuestionImageInput {
  filename: string
  contentType: string
  fileSizeBytes?: number
}

export interface PresignAdminQuestionImageResponse {
  uploadUrl: string
  objectKey: string
  publicUrl: string
  method: 'PUT'
  headers: Record<string, string>
  expiresIn: number
}
