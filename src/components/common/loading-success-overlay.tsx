'use client'

import type { HTMLAttributes } from 'react'
import { Check, LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

export type LoadingSuccessOverlayStatus = 'loading' | 'success'

interface LoadingSuccessOverlayProps extends HTMLAttributes<HTMLDivElement> {
  status: LoadingSuccessOverlayStatus
  visible?: boolean
  label?: string
  fullscreen?: boolean
}

export function LoadingSuccessOverlay({
  status,
  visible = true,
  label,
  fullscreen = false,
  className,
  ...props
}: LoadingSuccessOverlayProps) {
  if (!visible) return null

  const accessibleLabel = label ?? (status === 'loading' ? 'Đang tải' : 'Đã tải xong')

  return (
    <div
      {...props}
      className={cn(
        'cms-loading-success-overlay',
        fullscreen && 'cms-loading-success-overlay--fullscreen',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={accessibleLabel}
    >
      {status === 'loading' ? (
        <LoaderCircle className="cms-loading-success-overlay__icon cms-loading-success-overlay__spinner" aria-hidden />
      ) : (
        <Check className="cms-loading-success-overlay__icon cms-loading-success-overlay__success" aria-hidden />
      )}
    </div>
  )
}
