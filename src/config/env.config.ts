function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const env = {
  apiBaseUrl: trimTrailingSlash(rawApiBaseUrl || 'http://127.0.0.1:8000'),
} as const
