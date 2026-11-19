import { Trash2 } from 'lucide-react'

import { SearchableDataTable, type SearchableTableColumn } from '@/components/common/searchable-data-table'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { StaffFilter } from './staff-filter'

import type { AdminStaffRecord, AdminStaffRole } from '@/types/admin-staff.types'

interface StaffTableProps {
  rows: AdminStaffRecord[]
  search: string
  onSearchChange: (value: string) => void
  roleFilter: AdminStaffRole | null
  statusFilter: boolean | null
  onSelectStaff: (staff: AdminStaffRecord) => void
  onRequestStatusChange: (staff: AdminStaffRecord, isActive: boolean) => void
  onRequestHardDelete: (staff: AdminStaffRecord) => void
  onClearFilters: () => void
  isLoading?: boolean
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

export function StaffTable({
  rows,
  search,
  onSearchChange,
  roleFilter,
  statusFilter,
  onSelectStaff,
  onRequestStatusChange,
  onRequestHardDelete,
  onClearFilters,
  isLoading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: StaffTableProps) {
  const columns: SearchableTableColumn<AdminStaffRecord>[] = [
    { key: 'email', header: 'Email', cell: (row) => row.email },
    { key: 'createdAt', header: 'Ngày tạo', cell: (row) => row.createdAt },
    {
      key: 'actions',
      header: 'Action',
      cell: (row) => (
        <div className="cms-staff-table__actions" onClick={(event) => event.stopPropagation()}>
          <Switch
            checked={row.isActive}
            onCheckedChange={(checked) => onRequestStatusChange(row, checked)}
            aria-label={row.isActive ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
          />
          {!row.isActive ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="cms-staff-table__delete"
              aria-label="Xóa cứng tài khoản"
              onClick={() => onRequestHardDelete(row)}
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <SearchableDataTable
      rows={rows}
      columns={columns}
      getRowKey={(row) => row.id}
      getSearchText={(row) => `${row.email} ${row.role} ${row.isActive ? 'active' : 'inactive'}`}
      searchMode="server"
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo email, vai trò hoặc trạng thái"
      emptyMessage="Không tìm thấy tài khoản"
      onRowClick={onSelectStaff}
    isLoading={isLoading}
    infiniteScroll={onLoadMore ? {
      hasMore,
      isLoading: isLoadingMore,
      onLoadMore,
    } : undefined}
      toolbarEnd={
        <StaffFilter
          search={search}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onClear={onClearFilters}
        />
      }
    />
  )
}
