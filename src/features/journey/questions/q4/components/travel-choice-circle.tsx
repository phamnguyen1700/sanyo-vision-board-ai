import { useEffect, useState, type ReactNode } from 'react'

type TravelChoiceCircleProps = {
  children: ReactNode
  className?: string
  debounceValue?: string
}

export function TravelChoiceCircle({ children, className, debounceValue }: TravelChoiceCircleProps) {
  const isDebounced = debounceValue !== undefined
  const [settled, setSettled] = useState(!isDebounced)

  useEffect(() => {
    if (!isDebounced) return
    setSettled(false)
    const timer = window.setTimeout(() => setSettled(Boolean(debounceValue?.trim())), 1000)
    return () => window.clearTimeout(timer)
  }, [debounceValue, isDebounced])

  return (
    <span className={`travel-choice__text${className ? ` ${className}` : ''}${settled ? ' is-drawing' : ''}`}>
      {children}
      <svg className="travel-choice__circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="20" rx="47" ry="16" pathLength="1" />
      </svg>
    </span>
  )
}
