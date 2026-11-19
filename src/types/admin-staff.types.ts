export type AdminStaffRole = 'admin' | 'staff'

export interface CreateAdminStaffInput {
  email: string
  password: string
  confirmPassword: string
}

export interface AdminStaffRecord {
  id: string
  email: string
  role: AdminStaffRole
  isActive: boolean
  createdBy: string | null
  createdAt: string
  lastLoginAt: string | null
  updatedAt: string
}

export interface AdminStaffListQuery {
  search?: string
  role?: AdminStaffRole
  isActive?: boolean
  pageSize?: number
  cursor?: string
}

export interface AdminStaffListResponse {
  items: AdminStaffRecord[]
  nextCursor: string | null
  hasMore: boolean
  pageSize: number
}

export interface UpdateAdminStaffInput {
  email?: string
  role?: AdminStaffRole
  isActive?: boolean
}

export interface HardDeleteAdminStaffInput {
  email: string
}

export interface AdminStatsResponse {
  adminCount: number
  staffCount: number
  activeCount: number
  inactiveCount: number
}
