"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CmsField } from '@/components/common/cms-field'
import { Skeleton } from '@/components/ui/skeleton'

import type { AdminStaffRecord } from '@/types/admin-staff.types'

interface StaffDetailCardProps {
  staff: AdminStaffRecord | null
  isLoading?: boolean
}

export function StaffDetailCard({ staff, isLoading = false }: StaffDetailCardProps) {
  return (
    <Card className="cms-staff-detail-card cms-glass">
      <CardHeader>
        <CardTitle>Thông tin tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="cms-staff-detail-list cms-staff-detail-list--loading">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="cms-staff-detail-card__skeleton" />
            ))}
          </div>
        ) : staff ? (
          <>
            <div className="cms-staff-detail-list">
              <CmsField id="staff-detail-email" label="Email" value={staff.email} variant="line" editable={false} showPlaceholder={false} />
              <CmsField id="staff-detail-created-at" label="Ngày tạo" value={staff.createdAt} variant="line" editable={false} showPlaceholder={false} />
              <CmsField id="staff-detail-last-login" label="Đăng nhập cuối" value={staff.lastLoginAt ?? ''} variant="line" editable={false} placeholder="Chưa đăng nhập" />
            </div>
          </>
        ) : (
          <p className="cms-staff-detail-empty">Chọn một tài khoản để xem chi tiết.</p>
        )}
      </CardContent>
    </Card>
  )
}
