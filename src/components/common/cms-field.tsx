import type { ChangeEvent } from 'react'

import { Input } from '@/components/ui/input'

interface CmsFieldProps {
  id: string
  label: string
  value: string
  type?: string
  editable?: boolean
  showLabel?: boolean
  showPlaceholder?: boolean
  variant?: 'box' | 'line'
  placeholder?: string
  error?: string
  autoComplete?: string
  onChange?: (value: string) => void
}

export function CmsField({
  id,
  label,
  value,
  type = 'text',
  editable = true,
  showLabel = true,
  showPlaceholder = true,
  variant = 'line',
  placeholder,
  error,
  autoComplete,
  onChange,
}: CmsFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value)
  }

  return (
    <div className={`cms-common-field ${editable ? 'cms-common-field--editable' : 'cms-common-field--readonly'}`}>
      {showLabel ? <label htmlFor={editable ? id : undefined}>{label}</label> : null}
      {editable ? (
        <Input
          id={id}
          type={type}
          className={`cms-common-field__input cms-common-field__input--${variant}`}
          value={value}
          placeholder={showPlaceholder ? placeholder : undefined}
          aria-label={showLabel ? undefined : label}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          onChange={handleChange}
        />
      ) : (
        <span>{value || (showPlaceholder ? placeholder : '—')}</span>
      )}
      {error ? <p className="cms-common-field__error">{error}</p> : null}
    </div>
  )
}
