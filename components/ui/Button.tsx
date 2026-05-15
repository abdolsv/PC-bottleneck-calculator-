// components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-[--clr-accent] text-[--clr-bg] hover:opacity-90 font-semibold shadow-[0_0_20px_rgba(0,212,255,0.25)]',
  secondary: 'bg-[--clr-bg-elevated] border border-[--clr-border-glow] text-[--clr-text-primary] hover:border-[--clr-accent] hover:text-[--clr-accent]',
  ghost:     'bg-transparent text-[--clr-text-secondary] hover:text-[--clr-text-primary] hover:bg-[--clr-bg-card]',
  danger:    'bg-[--clr-critical] text-white hover:opacity-90 font-semibold',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[--radius-sm]',
  md: 'px-5 py-2.5 text-sm rounded-[--radius-md]',
  lg: 'px-7 py-3.5 text-base rounded-[--radius-md]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          transition-all duration-[--transition-fast]
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:ring-2 focus-visible:ring-[--clr-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--clr-bg]
          ${variantStyles[variant]} ${sizeStyles[size]} ${className}
        `}
        {...props}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'
