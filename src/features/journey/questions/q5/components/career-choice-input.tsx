import { useEffect, useState } from 'react'

type CareerChoiceInputProps = {
  value: string
  onChange: (value: string) => void
}

export function CareerChoiceInput({ value, onChange }: CareerChoiceInputProps) {
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    setSettled(false)
    const timer = window.setTimeout(() => setSettled(value.trim().length > 0), 1000)
    return () => window.clearTimeout(timer)
  }, [value])

  return (
    <span className="career-choice__custom-input">
      <input autoFocus aria-label="Thành tựu tự chọn" value={value} size={Math.max(14, value.length || 14)} onChange={(event) => onChange(event.target.value)} placeholder="Viết thành tựu khác" />
      <span className={`career-choice__underline ${settled ? 'is-drawing' : ''}`} aria-hidden="true" />
    </span>
  )
}
