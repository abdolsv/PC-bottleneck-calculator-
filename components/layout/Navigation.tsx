// components/layout/Navigation.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/',      label: 'Calculator' },
  { href: '/faq',   label: 'FAQ' },
  { href: '/blog',  label: 'Blog' },
  { href: '/about', label: 'About' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav>
      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-1">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`px-3 py-1.5 rounded-[--radius-sm] text-sm transition-colors duration-[--transition-fast]
                ${pathname === href
                  ? 'bg-[--clr-accent-dim] text-[--clr-accent] font-medium'
                  : 'text-[--clr-text-secondary] hover:text-[--clr-text-primary] hover:bg-[--clr-bg-elevated]'
                }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 text-[--clr-text-secondary] hover:text-[--clr-text-primary]"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[--clr-bg-card] border-b border-[--clr-border] px-4 py-3">
          <ul className="flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-[--radius-sm] text-sm
                    ${pathname === href
                      ? 'bg-[--clr-accent-dim] text-[--clr-accent]'
                      : 'text-[--clr-text-secondary]'
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
