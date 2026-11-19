import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  label: string
  value: number
  active?: boolean
  onClick?: () => void
  loading?: boolean
}

export function StatCard({ label, value, active = false, onClick, loading = false }: StatCardProps) {
  return (
    <Card
      className={`cms-common-stat-card cms-glass ${active ? 'cms-common-stat-card--active' : ''}`}
      data-clickable={Boolean(onClick)}
      role={onClick ? 'tab' : undefined}
      aria-selected={onClick ? active : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick()
        }
      }}
    >
      <CardContent className="cms-common-stat-card__content">
        <div className="cms-common-stat-card__label">
          {loading ? <Skeleton className="cms-common-stat-card__skeleton cms-common-stat-card__skeleton--label" /> : <span>{label}</span>}
        </div>
        {loading ? <Skeleton className="cms-common-stat-card__skeleton cms-common-stat-card__skeleton--value" /> : <strong>{value}</strong>}
      </CardContent>
    </Card>
  )
}
