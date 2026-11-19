import { create } from 'zustand'

import type { AdminAccount } from '@/types/auth.types'

interface AdminAuthState {
  account: AdminAccount | null
  setAccount: (account: AdminAccount | null) => void
  clearAccount: () => void
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
  clearAccount: () => set({ account: null }),
}))
