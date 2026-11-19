import { useEffect, useState } from 'react'

type LearningChoiceInputProps = {
  value: string
  onChange: (value: string) => void
}

export function LearningChoiceInput({ value, onChange }: LearningChoiceInputProps) {
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    setSettled(false)
    const timer = window.setTimeout(() => setSettled(value.trim().length > 0), 1000)
    return () => window.clearTimeout(timer)
  }, [value])

  return (
    <span className="learning-choice__custom-input">
      <input
        autoFocus
        aria-label="Kỹ năng tự chọn"
        value={value}
        size={Math.max(14, value.length || 14)}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Viết lựa chọn khác"
      />
      <span className={`learning-choice__custom-underline ${settled ? 'is-drawing' : ''}`} aria-hidden="true" />
    </span>
  )
}
