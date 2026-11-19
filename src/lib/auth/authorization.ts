import type { AdminAccount, AccountRole } from '@/types/auth.types'

export function hasRole(
  account: AdminAccount | null | undefined,
  role: AccountRole,
) {
  return account?.role === role
}

export function isAdmin(account: AdminAccount | null | undefined) {
  return hasRole(account, 'admin')
}

export function canManageStaff(account: AdminAccount | null | undefined) {
  return isAdmin(account)
}
