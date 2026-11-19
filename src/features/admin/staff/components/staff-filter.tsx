import type { AdminStaffRole } from '@/types/admin-staff.types'

interface StaffFilterProps {
  search: string
  roleFilter: AdminStaffRole | null
  statusFilter: boolean | null
  onClear: () => void
}

export function StaffFilter({ search, roleFilter, statusFilter, onClear }: StaffFilterProps) {
  if (!search && !roleFilter && statusFilter === null) return null

  return (
    <div className="cms-staff-filter">
      {search ? <span className="cms-staff-filter__badge">Tìm: {search}</span> : null}
      {roleFilter ? (
        <span className="cms-staff-filter__badge">
          {roleFilter === 'admin' ? 'Quản trị viên' : 'staff'}
        </span>
      ) : null}
      {statusFilter !== null ? (
        <span className="cms-staff-filter__badge">
          {statusFilter ? 'Đang hoạt động' : 'Ngưng hoạt động'}
        </span>
      ) : null}
      <button type="button" className="cms-staff-filter__clear" onClick={onClear}>
        Xóa bộ lọc
      </button>
    </div>
  )
}
