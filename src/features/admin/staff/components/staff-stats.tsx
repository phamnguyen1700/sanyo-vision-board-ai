import { StatCard } from '@/components/common/stat-card'

import type { AdminStaffRole } from '@/types/admin-staff.types'

interface StaffStatsProps {
  counts: Record<AdminStaffRole, number>
  statusCounts: { active: number; inactive: number }
  selectedRole: AdminStaffRole | null
  selectedStatus: boolean | null
  onSelectRole: (role: AdminStaffRole | null) => void
  onSelectStatus: (status: boolean | null) => void
  isLoading?: boolean
}

export function StaffStats({
  counts,
  statusCounts,
  selectedRole,
  selectedStatus,
  onSelectRole,
  onSelectStatus,
  isLoading = false,
}: StaffStatsProps) {
  return (
    <div className="cms-staff-stats">
      <StatCard
        label="Quản trị viên"
        value={counts.admin}
        active={selectedRole === 'admin'}
        onClick={() => onSelectRole(selectedRole === 'admin' ? null : 'admin')}
        loading={isLoading}
      />
      <StatCard
        label="Staff"
        value={counts.staff}
        active={selectedRole === 'staff'}
        onClick={() => onSelectRole(selectedRole === 'staff' ? null : 'staff')}
        loading={isLoading}
      />
      <StatCard
        label="Đang hoạt động"
        value={statusCounts.active}
        active={selectedStatus === true}
        onClick={() => onSelectStatus(selectedStatus === true ? null : true)}
        loading={isLoading}
      />
      <StatCard
        label="Ngưng hoạt động"
        value={statusCounts.inactive}
        active={selectedStatus === false}
        onClick={() => onSelectStatus(selectedStatus === false ? null : false)}
        loading={isLoading}
      />
    </div>
  )
}
