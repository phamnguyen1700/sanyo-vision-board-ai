'use client'

import { Toaster as UiToaster } from '@/components/ui/sonner'
import { getApiErrorMessage } from '@/lib/api/errors'
import { CircleAlert } from 'lucide-react'
import { toast } from 'sonner'

const toastOptions = {
  duration: 4000,
  className: 'cms-toast-shell',
}

type CmsToastVariant = 'success' | 'validation' | 'server'

function showToast(message: string, variant: CmsToastVariant) {
  toast.custom(
    () => (
      <div className={`cms-toast-card cms-toast-card--${variant}`} role="alert">
        <div className="cms-toast-card__header">
          <CircleAlert aria-hidden="true" />
          <span>Thông báo</span>
        </div>
        <div className="cms-toast-card__body">{message}</div>
      </div>
    ),
    toastOptions,
  )
}

export const cmsToast = {
  success(message: string) {
    showToast(message, 'success')
  },
  validation(message: string) {
    showToast(message, 'validation')
  },
  server(message: string) {
    showToast(message, 'server')
  },
  apiError(error: unknown) {
    const message = getApiErrorMessage(error)
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status?: number }).status)
      : 0

    if (status >= 500 || status === 429) {
      cmsToast.server(message)
      return
    }

    cmsToast.validation(message)
  },
}

export function CmsToaster() {
  return <UiToaster />
}
