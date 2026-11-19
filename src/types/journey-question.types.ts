export type JourneyQuestionType = 'frame_selection' | 'single_choice'

export interface JourneyQuestionAnswer {
  code: string
  content: string
  value: string
  imageUrl: string | null
  sortOrder: number
}

export interface JourneyQuestion {
  code: string
  content: string
  type: JourneyQuestionType
  sortOrder: number
  allowCustomAnswer: boolean
  answers: JourneyQuestionAnswer[]
}

export interface JourneyQuestionsResponse {
  items: JourneyQuestion[]
}
