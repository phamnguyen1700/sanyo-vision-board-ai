export type AccountRole = 'admin' | 'staff'

export interface AdminAccount {
  id: string
  email: string
  role: AccountRole
  isActive: boolean
  createdBy: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminAuthResponse {
  admin: AdminAccount
}

export interface AdminLoginRequest {
  email: string
  password: string
}
