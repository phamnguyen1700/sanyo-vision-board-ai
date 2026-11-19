'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

import { ConfirmCard } from '@/components/common/confirm-card'
import { CreateStaffCard } from '@/components/common/create-staff-card'
import { Button } from '@/components/ui/button'
import { useAdminStaff, useAdminStaffList, useAdminStats, useCreateAdminStaff, useHardDeleteAdminStaff, useUpdateAdminStaff } from '@/hooks/admin'
import type { AdminStaffRecord, AdminStaffRole, CreateAdminStaffInput } from '@/types/admin-staff.types'

import { StaffDetailCard } from './components/staff-detail-card'
import { StaffStats } from './components/staff-stats'
import { StaffTable } from './components/staff-table'

type StaffPanelView = 'list' | 'create' | 'status' | 'delete'

export function AdminStaffFeature() {
  const [selectedRole, setSelectedRole] = useState<AdminStaffRole | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [panelView, setPanelView] = useState<StaffPanelView>('list')
  const [pendingStaff, setPendingStaff] = useState<AdminStaffRecord | null>(null)
  const [nextStatus, setNextStatus] = useState(true)
  const [deleteEmail, setDeleteEmail] = useState('')

  const statsQuery = useAdminStats()
  const staffListQuery = useAdminStaffList({
    search: search || undefined,
    role: selectedRole ?? undefined,
    isActive: selectedStatus ?? undefined,
    pageSize: 10,
  })
  const staffRecords = useMemo(
    () => staffListQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [staffListQuery.data],
  )
  const staffDetailQuery = useAdminStaff(selectedStaffId)
  const createStaff = useCreateAdminStaff()
  const updateStaff = useUpdateAdminStaff()
  const hardDeleteStaff = useHardDeleteAdminStaff()

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    if (!staffRecords.length) {
      setSelectedStaffId(null)
      return
    }
    if (!selectedStaffId || !staffRecords.some((staff) => staff.id === selectedStaffId)) {
      setSelectedStaffId(staffRecords[0].id)
    }
  }, [selectedStaffId, staffRecords])

  const selectedStaff = staffDetailQuery.data ?? staffRecords.find((staff) => staff.id === selectedStaffId) ?? null
  const counts = {
    admin: statsQuery.data?.adminCount ?? 0,
    staff: statsQuery.data?.staffCount ?? 0,
  }
  const statusCounts = {
    active: statsQuery.data?.activeCount ?? 0,
    inactive: statsQuery.data?.inactiveCount ?? 0,
  }
  const isStatsLoading = statsQuery.isLoading || statsQuery.isFetching
  const isStaffListLoading = staffListQuery.isLoading || (
    staffListQuery.isFetching && !staffListQuery.isFetchingNextPage
  )

  const closePanelCard = () => {
    setPanelView('list')
    setPendingStaff(null)
    setDeleteEmail('')
  }

  const requestStatusChange = (staff: AdminStaffRecord, isActive: boolean) => {
    setPendingStaff(staff)
    setNextStatus(isActive)
    setDeleteEmail('')
    setPanelView('status')
  }

  const requestHardDelete = (staff: AdminStaffRecord) => {
    setPendingStaff(staff)
    setDeleteEmail('')
    setPanelView('delete')
  }

  const confirmPanelAction = () => {
    if (!pendingStaff) return
    if (panelView === 'status') {
      updateStaff.mutate(
        { staffId: pendingStaff.id, body: { isActive: nextStatus } },
        { onSuccess: closePanelCard },
      )
    }
    if (panelView === 'delete') {
      hardDeleteStaff.mutate(
        { staffId: pendingStaff.id, body: { email: deleteEmail.trim() } },
        { onSuccess: closePanelCard },
      )
    }
  }

  const handleCreateStaff = (input: CreateAdminStaffInput) => {
    createStaff.mutate(input, { onSuccess: closePanelCard })
  }

  const panelTitle = panelView === 'create'
    ? 'Thêm quản trị viên'
    : panelView === 'status'
      ? nextStatus ? 'Xác nhận kích hoạt' : 'Xác nhận xóa mềm'
      : panelView === 'delete'
        ? 'Xác nhận xóa'
        : selectedRole === 'admin'
          ? 'Danh sách quản trị viên'
          : selectedRole === 'staff'
            ? 'Danh sách staff'
            : selectedStatus === true
              ? 'Danh sách đang hoạt động'
              : selectedStatus === false
                ? 'Danh sách ngưng hoạt động'
                : 'Danh sách tài khoản'

  return (
    <section className="cms-staff-page">
      <StaffStats
        counts={counts}
        statusCounts={statusCounts}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
        onSelectRole={setSelectedRole}
        onSelectStatus={setSelectedStatus}
        isLoading={isStatsLoading}
      />
      <div className="cms-staff-content-grid">
        <section className="cms-staff-table-shell cms-glass">
          <div className="cms-staff-panel__header">
            <h2>{panelTitle}</h2>
            {panelView === 'list' ? (
              <Button type="button" size="sm" className="cms-staff-table__add" onClick={() => setPanelView('create')}>
                <Plus />
                Quản trị viên
              </Button>
            ) : null}
          </div>
          <div key={panelView} className="cms-staff-panel__content cms-panel-motion">
            {panelView === 'list' ? (
              <StaffTable
                rows={staffRecords}
                search={searchInput}
                onSearchChange={setSearchInput}
                roleFilter={selectedRole}
                statusFilter={selectedStatus}
                isLoading={isStaffListLoading}
                hasMore={staffListQuery.hasNextPage}
                isLoadingMore={staffListQuery.isFetchingNextPage}
                onLoadMore={() => staffListQuery.fetchNextPage()}
                onSelectStaff={(staff) => setSelectedStaffId(staff.id)}
                onRequestStatusChange={requestStatusChange}
                onRequestHardDelete={requestHardDelete}
                onClearFilters={() => {
                  setSearchInput('')
                  setSearch('')
                  setSelectedRole(null)
                  setSelectedStatus(null)
                }}
              />
            ) : panelView === 'create' ? (
              <CreateStaffCard
                title={panelTitle}
                isLoading={createStaff.isPending}
                onBack={closePanelCard}
                onSubmit={handleCreateStaff}
              />
            ) : (
              <ConfirmCard
                isLoading={updateStaff.isPending || hardDeleteStaff.isPending}
                onBack={closePanelCard}
                onConfirm={confirmPanelAction}
                variant={panelView === 'delete' ? 'danger' : 'warning'}
                title={panelTitle}
                description={panelView === 'delete'
                  ? undefined
                  : nextStatus
                    ? 'Tài khoản sẽ được phép đăng nhập và quản lý trở lại.'
                    : 'Tài khoản sẽ bị vô hiệu hóa nhưng vẫn còn trong hệ thống.'}
                confirmLabel={panelView === 'delete' ? 'Xóa cứng' : 'Xác nhận'}
                confirmInput={panelView === 'delete' && pendingStaff ? {
                  value: deleteEmail,
                  expectedValue: pendingStaff.email,
                  onChange: setDeleteEmail,
                  placeholder: pendingStaff.email,
                } : undefined}
              />
            )}
          </div>
        </section>
        <StaffDetailCard
          staff={selectedStaff}
          isLoading={staffDetailQuery.isLoading || staffDetailQuery.isFetching}
        />
      </div>
    </section>
  )
}
