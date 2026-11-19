import type { AdminAccount } from '@/types/auth.types'

export function isAuthenticated(account: AdminAccount | null | undefined) {
  return Boolean(account?.isActive)
}
