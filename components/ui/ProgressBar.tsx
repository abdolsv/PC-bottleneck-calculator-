// components/ui/ProgressBar.tsx
'use client'
import { useEffect, useRef } from 'react'

interface ProgressBarProps {
  value: number      // 0–100
  color?: string     // CSS var e.g. '--clr-accent'
  height?: number    // px
  animated?: boolean
  label?: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value,
  color = '--clr-accent',
  height = 8,
  animated = true,
  label,
  showValue,
  className = '',
}: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return
    barRef.current.style.width = '0%'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (barRef.current) barRef.current.style.width = `${Math.min(100, Math.max(0, value))}%`
      })
    })
  }, [value])

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-xs text-[--clr-text-secondary]">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono font-medium" style={{ color: `var(${color})` }}>
              {value}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden bg-[--clr-bg-elevated]"
        style={{ height }}
      >
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            backgroundColor: `var(${color})`,
            transition: animated ? 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            boxShadow: `0 0 8px var(${color})`,
            width: '0%',
          }}
        />
      </div>
    </div>
  )
}
