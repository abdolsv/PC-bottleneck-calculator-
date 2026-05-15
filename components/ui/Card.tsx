// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
  glow?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  onClick?: () => void
}

const paddingStyles = { sm: 'p-4', md: 'p-6', lg: 'p-8', none: '' }

export function Card({ children, className = '', elevated, glow, padding = 'md', onClick }: CardProps) {
  const base = elevated ? 'card-elevated' : 'card'
  const glowStyle = glow ? 'shadow-[0_0_30px_rgba(0,212,255,0.08)] hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]' : ''
  const clickable = onClick ? 'cursor-pointer transition-transform hover:scale-[1.01]' : ''

  return (
    <div
      className={`${base} ${paddingStyles[padding]} ${glowStyle} ${clickable} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
