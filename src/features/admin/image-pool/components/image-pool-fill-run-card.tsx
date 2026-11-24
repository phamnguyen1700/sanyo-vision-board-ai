import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CmsField } from '@/components/common/cms-field'

export interface ImagePoolFillRunPreview {
  status: string
  progress: string
  totalRequests: string
  totalFailed: string
  startedAt: string
  finishedAt: string
  duration: string
}

interface ImagePoolFillRunCardProps {
  run: ImagePoolFillRunPreview | null
}

export function ImagePoolFillRunCard({ run }: ImagePoolFillRunCardProps) {
  return (
    <Card className="cms-image-pool-fill-run-card">
      <CardHeader>
        <CardTitle>Thông tin lần chạy gần nhất</CardTitle>
      </CardHeader>
      <CardContent>
        {run ? (
          <div className="cms-image-pool-fill-run-card__list">
            <div className="cms-image-pool-fill-run-card__metrics">
              <CmsField id="image-pool-run-status" label="Trạng thái" value={run.status} variant="line" editable={false} showPlaceholder={false} />
              <CmsField id="image-pool-run-progress" label="Tổng ảnh đã nạp" value={run.progress} variant="line" editable={false} showPlaceholder={false} />
              <CmsField id="image-pool-run-requests" label="Tổng request" value={run.totalRequests} variant="line" editable={false} showPlaceholder={false} />
              <CmsField id="image-pool-run-failed" label="Tổng lỗi" value={run.totalFailed} variant="line" editable={false} showPlaceholder={false} />
            </div>
            <div className="cms-image-pool-fill-run-card__timing">
              <CmsField id="image-pool-run-started-at" label="Bắt đầu" value={run.startedAt} variant="line" editable={false} showPlaceholder={false} />
              <CmsField id="image-pool-run-finished-at" label="Kết thúc" value={run.finishedAt} variant="line" editable={false} showPlaceholder={false} />
              <CmsField id="image-pool-run-duration" label="Thời gian chạy" value={run.duration} variant="line" editable={false} showPlaceholder={false} />
            </div>
          </div>
        ) : (
          <p className="cms-image-pool-fill-run-card__empty">Chưa có lần chạy nào.</p>
        )}
      </CardContent>
    </Card>
  )
}
