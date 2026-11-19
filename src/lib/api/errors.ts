import axios from 'axios'

import type { ApiErrorBody, ApiErrorDetail } from '@/types/api.types'

export class ApiError extends Error {
  readonly code: string | undefined
  readonly details: ApiErrorDetail[] | undefined

  constructor(
    message: string,
    readonly status: number,
    body?: ApiErrorBody,
    readonly retryAfterSeconds?: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = body?.error.code
    this.details = body?.error.details
  }
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<ApiErrorBody>
  return Boolean(
    candidate.error && typeof candidate.error.message === 'string',
  )
}

export function normalizeApiError(error: unknown): ApiError | Error {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    const body = isApiErrorBody(error.response?.data)
      ? error.response.data
      : undefined
    const rawRetryAfter = error.response?.headers?.['retry-after']
    const retryAfterSeconds = Number(
      Array.isArray(rawRetryAfter) ? rawRetryAfter[0] : rawRetryAfter,
    )

    return new ApiError(
      body?.error.message || error.message || 'Request failed.',
      error.response?.status ?? 0,
      body,
      Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
        ? retryAfterSeconds
        : undefined,
    )
  }

  if (error instanceof Error) return error
  return new ApiError('Request failed.', 0)
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Không thể kết nối máy chủ.',
) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function isApiErrorCode(error: unknown, code: string) {
  return error instanceof ApiError && error.code === code
}
