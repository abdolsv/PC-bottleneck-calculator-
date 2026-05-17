import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'
import { footerLinks } from '@/lib/navigation-data'

const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const Github = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /></svg>
);

const Youtube = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" /><path d="m10 15 5-3-5-3z" /></svg>
);

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
            <p className="text-xs text-[--clr-text-muted] leading-relaxed mb-4">
              Free, instant CPU & GPU bottleneck analysis. No signup. No BS. Just results.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com/pcbottleneck" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-[--radius-sm] border border-[--clr-border] flex items-center justify-center text-[--clr-text-muted] hover:text-[--clr-accent] hover:border-[--clr-accent] transition-colors">
                <Twitter size={14} />
              </a>
              <a href="https://github.com/yourusername/pc-bottleneck-calculator" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-[--radius-sm] border border-[--clr-border] flex items-center justify-center text-[--clr-text-muted] hover:text-[--clr-accent] hover:border-[--clr-accent] transition-colors">
                <Github size={14} />
              </a>
              <a href="https://youtube.com/@pcbottleneck" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-[--radius-sm] border border-[--clr-border] flex items-center justify-center text-[--clr-text-muted] hover:text-[--clr-accent] hover:border-[--clr-accent] transition-colors">
                <Youtube size={14} />
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
