'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cpu, Menu, X, ChevronRight } from 'lucide-react'

const links = [
  { href: '/', label: 'Calculator', desc: 'Check your build' },
  { href: '/gpu', label: 'GPUs', desc: 'All graphics cards' },
  { href: '/cpu', label: 'CPUs', desc: 'All processors' },
  { href: '/games', label: 'Games', desc: 'Guides & analysis' },
  { href: '/faq', label: 'FAQ', desc: 'Common questions' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-[--clr-border] transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : ''
          }`}
        style={{ background: 'rgba(10, 11, 15, 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div
              className="w-7 h-7 rounded-[--radius-sm] flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(0,212,255,0.5)]"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)' }}
            >
              <Cpu size={14} className="text-[--clr-accent]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm tracking-tight">
                PC<span className="text-[--clr-accent]">Bottleneck</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-[--radius-sm] text-sm transition-all duration-150 ${active
                      ? 'bg-[rgba(0,212,255,0.1)] text-[--clr-accent] font-medium'
                      : 'text-[--clr-text-secondary] hover:text-[--clr-text-primary] hover:bg-[--clr-bg-elevated]'
                    }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-[--radius-sm] transition-opacity hover:opacity-90"
            style={{ background: '#00d4ff', color: '#0a0b0f' }}
          >
            Check My Build
            <ChevronRight size={14} />
          </Link>

          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[--radius-sm] transition-colors"
            style={{
              background: open ? 'rgba(0,212,255,0.1)' : 'transparent',
              border: '1px solid',
              borderColor: open ? 'rgba(0,212,255,0.4)' : 'rgba(42,45,56,1)',
              color: open ? '#00d4ff' : '#8b90a4',
            }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            className="fixed top-14 left-0 right-0 z-40 md:hidden border-b"
            style={{
              background: '#111318',
              borderColor: '#2a2d38',
            }}
          >
            {/* Links */}
            <nav className="px-4 py-3 space-y-1">
              {links.map(({ href, label, desc }) => {
                const active = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-[--radius-md] transition-all group"
                    style={{
                      background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                      border: '1px solid',
                      borderColor: active ? 'rgba(0,212,255,0.25)' : 'transparent',
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: active ? '#00d4ff' : '#f0f2f8' }}
                      >
                        {label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#4e5266' }}>{desc}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      style={{ color: active ? '#00d4ff' : '#4e5266' }}
                    />
                  </Link>
                )
              })}
            </nav>

            <div className="px-4 pb-4 pt-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-[--radius-md] text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: '#00d4ff', color: '#0a0b0f' }}
              >
                <Cpu size={16} />
                Check My Build — Free
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
