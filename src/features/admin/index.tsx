'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { ADMIN_SESSION_EXPIRED_EVENT, type AdminSessionExpiredDetail } from '@/lib/api/admin-auth-events'
import { getApiErrorMessage } from '@/lib/api/errors'
import { useAdminLogin, useAdminSession } from '@/hooks/admin'
import { useAdminAuthStore } from '@/stores/admin-auth.store'

import { AdminLoginCard } from './components/admin-login-card'
import { AdminSessionErrorCard } from './components/admin-session-error-card'
import { AdminShell } from './components/admin-shell'

export function AdminFeature({ children }: { children: ReactNode }) {
  const session = useAdminSession()
  const login = useAdminLogin()
  const account = useAdminAuthStore((state) => state.account)
  const [showLogin, setShowLogin] = useState(false)
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null)
  const redirectToLogin = useCallback(() => setShowLogin(true), [])

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const detail = (event as CustomEvent<AdminSessionExpiredDetail>).detail
      setShowLogin(false)
      setSessionExpiredMessage(detail?.message ?? 'Phiên đăng nhập đã hết hạn.')
    }

    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [])

  if (session.isPending && !account) {
    return (
      <section className="cms-admin-auth-state cms-glass">
        <p>Đang kiểm tra phiên đăng nhập...</p>
      </section>
    )
  }

  if (!account) {
    if (sessionExpiredMessage && !showLogin) {
      return (
        <AdminSessionErrorCard
          message={sessionExpiredMessage}
          onRedirect={redirectToLogin}
        />
      )
    }

    if (session.error && !showLogin && 'status' in session.error && session.error.status !== 401) {
      return (
        <AdminSessionErrorCard
          message={getApiErrorMessage(session.error)}
          onRedirect={redirectToLogin}
        />
      )
    }

    return (
      <AdminLoginCard
        isSubmitting={login.isPending}
        error={login.error}
        onSubmit={(body) => login.mutate(body)}
      />
    )
  }

  return <AdminShell>{children}</AdminShell>
}
