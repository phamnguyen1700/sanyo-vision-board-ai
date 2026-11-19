import type { ReactNode } from 'react'

import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

import { AdminSidebar } from './admin-sidebar'

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="cms-admin-layout">
      <AdminSidebar />
      <SidebarInset className="cms-admin-main">
        <main className="cms-admin-content">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
