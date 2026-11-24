export type PoolGender = 'male' | 'female'
export type PoolFillStatus = 'running' | 'stopping' | 'completed' | 'stopped' | 'failed'

export interface PoolFillRunResponse {
  id: string
  status: PoolFillStatus
  currentBatchNo: number
  totalBatches: number
  totalSteps: number
  completedSteps: number
  totalImages: number
  totalFailed: number
  totalRequests: number
  startedAt: string
  finishedAt: string | null
}

export interface PoolFillSummaryResponse {
  latestRun: PoolFillRunResponse | null
  totalRuns: number
}

export interface PoolImageStatsItem {
  gender: PoolGender
  questionCode: string
  answerValue: string
  count: number
}

export interface PoolImageStatsResponse {
  summary: {
    total: number
    exhaustedGroups: number
  }
  byGenderQuestion: Array<{
    gender: PoolGender
    questionCode: string
    count: number
  }>
  items: PoolImageStatsItem[]
}
