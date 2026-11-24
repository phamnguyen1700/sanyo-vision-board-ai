import { SearchableDataTable, type SearchableTableColumn } from '@/components/common/searchable-data-table'
import type { AdminPlayerRecord } from '@/types/admin-player.types'

import { PlayerFilter } from './player-filter'

interface PlayerTableProps {
  rows: AdminPlayerRecord[]
  search: string
  marketingConsent: boolean | null
  dataUsageConsent: boolean | null
  onSearchChange: (value: string) => void
  onClearFilters: () => void
  isLoading?: boolean
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function consentLabel(value: boolean) {
  return value ? 'Đồng ý' : 'Không đồng ý'
}

export function PlayerTable({
  rows,
  search,
  marketingConsent,
  dataUsageConsent,
  onSearchChange,
  onClearFilters,
  isLoading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: PlayerTableProps) {
  const columns: SearchableTableColumn<AdminPlayerRecord>[] = [
    { key: 'name', header: 'Tên', cell: (row) => row.name },
    { key: 'gender', header: 'Giới tính', cell: (row) => row.gender === 'female' ? 'Nữ' : 'Nam' },
    { key: 'phone', header: 'Số điện thoại', cell: (row) => row.phone },
    { key: 'marketingConsent', header: 'Nhận thông tin', cell: (row) => consentLabel(row.marketingConsent) },
    { key: 'dataUsageConsent', header: 'Lưu trữ dữ liệu', cell: (row) => consentLabel(row.dataUsageConsent) },
    { key: 'createdAt', header: 'Ngày tạo', cell: (row) => formatDate(row.createdAt) },
  ]

  return (
    <SearchableDataTable
      rows={rows}
      columns={columns}
      getRowKey={(row) => row.id}
      getSearchText={(row) => `${row.name} ${row.phone}`}
      title="Danh sách người chơi"
      searchMode="server"
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm theo tên người chơi"
      emptyMessage="Không tìm thấy người chơi"
      isLoading={isLoading}
      infiniteScroll={onLoadMore ? { hasMore, isLoading: isLoadingMore, onLoadMore } : undefined}
      toolbarEnd={
        <PlayerFilter
          search={search}
          marketingConsent={marketingConsent}
          dataUsageConsent={dataUsageConsent}
          onClear={onClearFilters}
        />
      }
    />
  )
}
