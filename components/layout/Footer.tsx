// components/layout/Footer.tsx
import Link from 'next/link'
import { Cpu, Mail } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'
import { footerLinks } from '@/lib/navigation-data'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[--clr-border] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-[--radius-sm] bg-[--clr-accent-dim] border border-[--clr-accent] flex items-center justify-center">
                <Cpu size={14} className="text-[--clr-accent]" />
              </div>
              <span className="font-bold text-sm">
                PC<span className="text-[--clr-accent]">Bottleneck</span>
              </span>
            </Link>
            
            {/* Expanded description with better context keywords */}
            <p className="text-xs text-[--clr-text-muted] leading-relaxed mb-4">
              Free, instant CPU & GPU bottleneck analysis tool. Calculate hardware compatibility, optimize your custom PC builds, and eliminate performance scaling issues. No signup required.
            </p>

            {/* Clean contact email section replacing social media icons */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[--clr-border]/50">
              <Mail size={12} className="text-[--clr-text-muted]" />
              <a 
                href="mailto:staysafewithusonline@gmail.com" 
                className="text-xs text-[--clr-text-muted] hover:text-[--clr-accent] transition-colors break-all"
              >
                staysafewithusonline@gmail.com
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-[--clr-text-primary] uppercase tracking-widest mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-xs text-[--clr-text-muted] hover:text-[--clr-accent] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[--clr-border] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[--clr-text-muted]">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-[--clr-text-muted] hover:text-[--clr-accent] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-[--clr-text-muted] hover:text-[--clr-accent] transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="text-xs text-[--clr-text-muted] hover:text-[--clr-accent] transition-colors">Sitemap</Link>
          </div>
          <p className="text-xs text-[--clr-text-muted]">
            Results are estimates. Not financial or purchase advice.
            <span className="text-[--clr-text-muted]"> *Affiliate links on this site.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
