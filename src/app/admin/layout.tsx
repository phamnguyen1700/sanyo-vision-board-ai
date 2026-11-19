import type { ReactNode } from 'react'

import { CmsThemeProvider } from '@/components/cms'
import { AdminFeature } from '@/features/admin'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <CmsThemeProvider>
      <AdminFeature>{children}</AdminFeature>
    </CmsThemeProvider>
  )
}
