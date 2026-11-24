import { Skeleton } from '@/components/ui/skeleton'

export function ImagePoolChartSkeleton() {
  return (
    <div className="cms-image-pool-chart-skeleton" aria-label="Đang tải biểu đồ image pool">
      <Skeleton className="cms-image-pool-chart-skeleton__heading" />
      <Skeleton className="cms-image-pool-chart-skeleton__description" />
      <Skeleton className="cms-image-pool-chart-skeleton__plot" />
    </div>
  )
}

export function ImagePoolFillRunSkeleton() {
  return (
    <div className="cms-image-pool-fill-run-skeleton" aria-label="Đang tải thông tin lần chạy gần nhất">
      <Skeleton className="cms-image-pool-fill-run-skeleton__heading" />
      <div className="cms-image-pool-fill-run-skeleton__metrics">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="cms-image-pool-fill-run-skeleton__field">
            <Skeleton className="cms-image-pool-fill-run-skeleton__label" />
            <Skeleton className="cms-image-pool-fill-run-skeleton__value" />
          </div>
        ))}
      </div>
      <div className="cms-image-pool-fill-run-skeleton__timing">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="cms-image-pool-fill-run-skeleton__field">
            <Skeleton className="cms-image-pool-fill-run-skeleton__label" />
            <Skeleton className="cms-image-pool-fill-run-skeleton__value" />
          </div>
        ))}
      </div>
    </div>
  )
}
