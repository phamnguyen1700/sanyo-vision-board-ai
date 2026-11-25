'use client'

import { useEffect, useRef, useState } from 'react'

import { LoadingSuccessOverlay } from '@/components/common/loading-success-overlay'
import { cmsToast } from '@/components/common/cms-toast'
import { ImagePoolChart } from './components/image-pool-chart'
import { ImagePoolFillRunCard } from './components/image-pool-fill-run-card'
import { ImagePoolChartSkeleton, ImagePoolFillRunSkeleton } from './components/image-pool-loading-skeleton'
import { Switch } from '@/components/ui/switch'
import { queryClient } from '@/lib/query/query-client'
import { queryKeys } from '@/lib/query/query-keys'
import {
  useAdminImagePoolFillStatus,
  useAdminImagePoolFillSummary,
  useAdminImagePoolStats,
  useResumeAdminImagePoolFill,
  useStartAdminImagePoolFill,
  useStopAdminImagePoolFill,
} from '@/hooks/admin'
import type { PoolFillStatus } from '@/types/admin-image-pool.types'

const terminalStatuses: PoolFillStatus[] = ['completed', 'stopped', 'failed']

function formatRunDate(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value))
}

function formatRunStatus(status: PoolFillStatus) {
  return {
    running: 'Đang chạy',
    stopping: 'Đang hoàn tất',
    completed: 'Đã hoàn tất',
    stopped: 'Đã dừng',
    failed: 'Thất bại',
  }[status]
}

export function AdminImagePoolFeature() {
  const statsQuery = useAdminImagePoolStats()
  const fillStatusQuery = useAdminImagePoolFillStatus()
  const isProcessing = fillStatusQuery.data?.status === 'running' || fillStatusQuery.data?.status === 'stopping'
  const fillSummaryQuery = useAdminImagePoolFillSummary(!isProcessing)
  const startFill = useStartAdminImagePoolFill()
  const stopFill = useStopAdminImagePoolFill()
  const resumeFill = useResumeAdminImagePoolFill()
  const [showCompletion, setShowCompletion] = useState(false)
  const wasProcessingRef = useRef(false)
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const status = fillStatusQuery.data?.status
    const processing = status === 'running' || status === 'stopping'

    if (wasProcessingRef.current && status && terminalStatuses.includes(status)) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.stats() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.imagePool.fillSummary() })
      setShowCompletion(true)
      completionTimerRef.current = setTimeout(() => setShowCompletion(false), 700)
    }

    wasProcessingRef.current = processing
  }, [fillStatusQuery.data?.status])

  const handleFillToggle = (enabled: boolean) => {
    if (enabled) {
      startFill.mutate(undefined, {
        onError: () => cmsToast.server('Không thể bắt đầu tiến trình nạp image pool.'),
      })
      return
    }

    if (isProcessing) {
      cmsToast.success('Chart sẽ cập nhật sau khi tiến trình hoàn tất.')
      stopFill.mutate(undefined, {
        onError: () => cmsToast.server('Không thể dừng tiến trình nạp image pool.'),
      })
    }
  }

  const latestRun = fillSummaryQuery.data?.latestRun
  const latestRunPreview = latestRun
    ? {
        status: formatRunStatus(latestRun.status),
        progress: `${latestRun.totalImages} ảnh`,
        totalRequests: String(latestRun.totalRequests),
        totalFailed: String(latestRun.totalFailed),
        canResume: latestRun.canResume,
        startedAt: formatRunDate(latestRun.startedAt),
        finishedAt: formatRunDate(latestRun.finishedAt),
        duration: latestRun.finishedAt
          ? `${Math.max(0, Math.round((new Date(latestRun.finishedAt).getTime() - new Date(latestRun.startedAt).getTime()) / 60000))} phút`
          : 'Đang chạy',
      }
    : null

  const overlayStatus = showCompletion ? 'success' : 'loading'

  return (
    <div className="cms-image-pool-feature">
      <section className="cms-glass cms-image-pool-page">
        <header className="cms-image-pool-page__header">
          <h1>Image Pool</h1>
          <label className="cms-image-pool-page__fill-toggle">
            <span className="cms-image-pool-page__fill-toggle-label">AI Generation</span>
            <Switch
              checked={isProcessing}
              onCheckedChange={handleFillToggle}
              disabled={
                startFill.isPending ||
                stopFill.isPending ||
                fillStatusQuery.isLoading ||
                fillStatusQuery.data?.status === 'stopping'
              }
              aria-label="Bật hoặc tắt nạp image pool"
            />
          </label>
        </header>
        {statsQuery.isLoading ? (
          <ImagePoolChartSkeleton />
        ) : statsQuery.isError ? (
          <p className="cms-image-pool-page__state cms-image-pool-page__state--error">
            Không thể tải thống kê image pool.
          </p>
        ) : statsQuery.data ? (
          <div className="cms-image-pool-chart-stage">
            <ImagePoolChart data={statsQuery.data} />
            <LoadingSuccessOverlay
              status={overlayStatus}
              visible={isProcessing || showCompletion}
              label={showCompletion ? 'Nạp image pool đã hoàn tất' : 'Đang nạp image pool'}
            />
          </div>
        ) : null}
      </section>
      {!isProcessing && !showCompletion ? (
        <section className="cms-glass cms-image-pool-run-page">
          {statsQuery.isLoading || fillSummaryQuery.isLoading ? (
            <ImagePoolFillRunSkeleton />
          ) : (
            <ImagePoolFillRunCard
              run={latestRunPreview}
              isResuming={resumeFill.isPending}
              onResume={() => {
                if (!latestRun?.canResume) return
                resumeFill.mutate(latestRun.id, {
                  onError: () => cmsToast.server('Không thể resume các ảnh bị lỗi.'),
                })
              }}
            />
          )}
        </section>
      ) : null}
    </div>
  )
}
