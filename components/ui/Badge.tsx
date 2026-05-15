// components/ui/Badge.tsx
type BadgeVariant = 'default' | 'ok' | 'low' | 'medium' | 'high' | 'critical'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
}

const badgeStyles: Record<BadgeVariant, string> = {
  default:  'bg-[--clr-bg-elevated] text-[--clr-text-secondary] border-[--clr-border]',
  ok:       'bg-[rgba(0,212,255,0.1)] text-[--clr-ok] border-[rgba(0,212,255,0.3)]',
  low:      'bg-[rgba(34,211,160,0.1)] text-[--clr-low] border-[rgba(34,211,160,0.3)]',
  medium:   'bg-[rgba(245,165,36,0.1)] text-[--clr-medium] border-[rgba(245,165,36,0.3)]',
  high:     'bg-[rgba(239,68,68,0.1)] text-[--clr-high] border-[rgba(239,68,68,0.3)]',
  critical: 'bg-[rgba(255,32,86,0.1)] text-[--clr-critical] border-[rgba(255,32,86,0.3)]',
}

export function Badge({ variant = 'default', children, dot }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5
      text-xs font-medium rounded-full border
      ${badgeStyles[variant]}
    `}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  )
}
