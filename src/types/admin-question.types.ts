export type AdminQuestionType = 'frame_selection' | 'single_choice'

export interface AdminQuestionAnswer {
  id: string
  questionId: string
  code: string
  content: string
  value: string
  imageUrl: string | null
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
  imageUrl?: string | null
  sortOrder: number
}

export interface UpdateAdminQuestionAnswerInput {
  content?: string
  value?: string
  imageUrl?: string | null
  sortOrder?: number
}
