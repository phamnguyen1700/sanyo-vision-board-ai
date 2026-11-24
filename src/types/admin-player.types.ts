export interface AdminPlayerRecord {
  id: string
  name: string
  gender: string
  phone: string
  marketingConsent: boolean
  dataUsageConsent: boolean
  createdAt: string
}

export interface AdminPlayerStatsResponse {
  totalPlayers: number
  marketingConsentCount: number
  dataUsageConsentCount: number
}

export interface AdminPlayerListResponse {
  items: AdminPlayerRecord[]
  nextCursor: string | null
  hasMore: boolean
  pageSize: number
}

export interface AdminPlayerListQuery {
  cursor?: string
  pageSize?: number
  search?: string
  marketingConsent?: boolean
  dataUsageConsent?: boolean
}
