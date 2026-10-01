'use client'

export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    event.currentTarget.style.setProperty('--tilt-x', `${y * -5}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${x * 5}deg`)
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  const reset = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <div className={`tilt-card ${className}`} onPointerMove={handleMove} onPointerLeave={reset}>
      {children}
    </div>
  )
}
