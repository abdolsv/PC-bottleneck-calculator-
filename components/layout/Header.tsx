// components/layout/Header.tsx
import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { Navigation } from './Navigation'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[--clr-border] bg-[rgba(10,11,15,0.85)] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-[--radius-sm] bg-[--clr-accent-dim] border border-[--clr-accent] flex items-center justify-center transition-all duration-[--transition-fast] group-hover:shadow-[0_0_12px_rgba(0,212,255,0.4)]">
            <Cpu size={14} className="text-[--clr-accent]" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            PC<span className="text-[--clr-accent]">Bottleneck</span>
          </span>
          <span className="hidden sm:block text-[--clr-text-muted] text-xs">Calculator</span>
        </Link>

        <Navigation />

        {/* CTA */}
        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[--radius-sm] bg-[--clr-accent] text-[--clr-bg] hover:opacity-90 transition-opacity"
        >
          Check My Build
        </Link>
      </div>
    </header>
  )
}
