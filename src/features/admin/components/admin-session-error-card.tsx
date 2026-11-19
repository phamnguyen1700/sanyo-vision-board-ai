'use client'

import { useEffect, useState } from 'react'

import { ConfirmCard } from '@/components/common/confirm-card'

interface AdminSessionErrorCardProps {
  message: string
  onRedirect: () => void
}

export function AdminSessionErrorCard({ message, onRedirect }: AdminSessionErrorCardProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0))
    }, 1000)
    const timeout = window.setTimeout(onRedirect, 5000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [onRedirect])

  return (
    <main className="cms-admin-auth-error-page">
      <ConfirmCard
        variant="danger"
        title="Không thể xác thực phiên"
        description={`${message} Tự chuyển về trang đăng nhập sau ${countdown}s.`}
        confirmLabel="Về đăng nhập"
        showBack={false}
        onBack={onRedirect}
        onConfirm={onRedirect}
      />
    </main>
  )
}
