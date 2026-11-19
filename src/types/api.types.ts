export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR'
  | (string & {})

export interface ApiErrorDetail {
  field: string | null
  message: string
}

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode
    message: string
    details?: ApiErrorDetail[]
  }
}
