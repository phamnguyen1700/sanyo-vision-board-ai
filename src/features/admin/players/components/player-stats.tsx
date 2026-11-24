import { StatCard } from '@/components/common/stat-card'
import type { AdminPlayerStatsResponse } from '@/types/admin-player.types'

interface PlayerStatsProps {
  stats?: AdminPlayerStatsResponse
  marketingConsent: boolean | null
  dataUsageConsent: boolean | null
  onSelectMarketingConsent: () => void
  onSelectDataUsageConsent: () => void
  isLoading?: boolean
}

export function PlayerStats({
  stats,
  marketingConsent,
  dataUsageConsent,
  onSelectMarketingConsent,
  onSelectDataUsageConsent,
  isLoading = false,
}: PlayerStatsProps) {
  return (
    <div className="cms-player-stats">
      <StatCard label="Tổng số người chơi" value={stats?.totalPlayers ?? 0} loading={isLoading} />
      <StatCard
        label="Đồng ý nhận thông tin"
        value={stats?.marketingConsentCount ?? 0}
        active={marketingConsent === true}
        onClick={onSelectMarketingConsent}
        loading={isLoading}
      />
      <StatCard
        label="Đồng ý lưu trữ dữ liệu"
        value={stats?.dataUsageConsentCount ?? 0}
        active={dataUsageConsent === true}
        onClick={onSelectDataUsageConsent}
        loading={isLoading}
      />
    </div>
  )
}
