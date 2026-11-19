'use client'

import { Button } from '@/components/ui/button'
import { LoadingSuccessOverlay } from '@/components/common/loading-success-overlay'
import { CmsField } from '@/components/common/cms-field'
import { useCmsTheme } from '@/components/cms'

type ConfirmCardVariant = 'danger' | 'warning'

interface ConfirmCardProps {
  onBack: () => void
  onConfirm: () => void
  variant?: ConfirmCardVariant
  title: string
  description?: string
  confirmLabel?: string
  showBack?: boolean
  isLoading?: boolean
  confirmInput?: {
    value: string
    expectedValue: string
    onChange: (value: string) => void
    placeholder?: string
  }
}

export function ConfirmCard({
  onBack,
  onConfirm,
  variant = 'warning',
  title,
  description,
  confirmLabel = 'Xác nhận',
  showBack = true,
  isLoading = false,
  confirmInput,
}: ConfirmCardProps) {
  const { theme } = useCmsTheme()
  const canConfirm = !confirmInput || confirmInput.value.trim() === confirmInput.expectedValue

  return (
    <section className={`cms-confirm-card cms-confirm-card--${variant} cms-confirm-card--${theme}`}>
      {isLoading ? <LoadingSuccessOverlay status="loading" label="Đang xử lý" /> : null}
      <header className="cms-confirm-card__header">
        <h2>{title}</h2>
      </header>
      {description ? <p className="cms-confirm-card__description">{description}</p> : null}
      {confirmInput ? (
        <div className="cms-confirm-card__confirmation">
          <p>
            Nhập lại: <strong>{confirmInput.expectedValue}</strong> để xóa
          </p>
          <CmsField
            id="confirm-card-input"
            label="Email xác nhận"
            value={confirmInput.value}
            variant="box"
            showLabel={false}
            placeholder={confirmInput.placeholder ?? confirmInput.expectedValue}
            autoComplete="off"
            onChange={confirmInput.onChange}
          />
        </div>
      ) : null}
      <footer className="cms-confirm-card__footer">
        {showBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            Quay lại
          </Button>
        ) : null}
        <Button type="button" className="cms-confirm-card__action" onClick={onConfirm} disabled={!canConfirm}>
          {confirmLabel}
        </Button>
      </footer>
    </section>
  )
}
