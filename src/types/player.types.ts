export type PlayerManifestAnswerInput = {
  questionCode: string
  values: string[]
  customText?: string
}

export type PlayerManifestRequest = {
  name: string
  gender: string
  phone: string
  marketingConsent: boolean
  dataUsageConsent: boolean
  answers: PlayerManifestAnswerInput[]
}

export type PlayerAnswerResponse = {
  questionCode: string
  answerValue: string | null
  customText: string | null
}

export type PlayerImageResponse = {
  questionCode: string
  answerId: string | null
  imageKey: string
  imageUrl: string
}

export type PlayerResponse = {
  id: string
  name: string
  gender: string
  phone: string
  marketingConsent: boolean
  dataUsageConsent: boolean
  createdAt: string
  answers: PlayerAnswerResponse[]
  images: PlayerImageResponse[]
}

export type PlayerCustomImageGenerateRequest = {
  questionCode: string
}

export type PlayerImageGenerationStatus = 'loading' | 'loaded' | 'error'
