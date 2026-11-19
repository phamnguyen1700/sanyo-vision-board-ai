'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleHelp, LayoutDashboard, LogOut, Settings, ShieldCheck, Users } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAdminLogout } from '@/hooks/admin'
import { useAdminAuthStore } from '@/stores/admin-auth.store'

const navigationItems = [
  { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
  { label: 'Người chơi', href: '/admin/players', icon: Users },
  { label: 'Quản trị viên', href: '/admin/staff', icon: ShieldCheck },
  { label: 'Câu hỏi', href: '/admin/questions', icon: CircleHelp },
  { label: 'Cài đặt', href: '/admin/settings', icon: Settings },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const account = useAdminAuthStore((state) => state.account)
  const logout = useAdminLogout()

  return (
    <Sidebar className="cms-admin-sidebar" collapsible="icon" variant="sidebar">
      <SidebarHeader className="cms-admin-sidebar__header">
        <img className="cms-admin-sidebar__logo" src="/sanyo-logo.png" alt="SANYO" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = item.href === '/admin'
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="cms-admin-sidebar__footer">
        <div className="cms-admin-sidebar__account">
          <span>{account?.email}</span>
          <small>{account?.role === 'admin' ? 'Quản trị viên' : 'Staff'}</small>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              tooltip="Đăng xuất"
            >
              <LogOut />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
