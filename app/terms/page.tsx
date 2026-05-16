// app/terms/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${SITE_NAME}.`,
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-xs text-[--clr-text-muted] mb-10">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </p>

        <div className="space-y-8 text-[--clr-text-secondary] text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-[--clr-text-primary] mb-2">1. Acceptance of Terms</h2>
            <p>By accessing {SITE_NAME}, you agree to these terms. If you disagree, please do not use the site.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[--clr-text-primary] mb-2">2. Use of the Calculator</h2>
            <p>
              The bottleneck calculator provides estimates based on benchmark data and weighted formulas.
              Results are intended as directional guidance only. We make no guarantee of accuracy.
              Real-world PC performance varies based on game optimization, driver versions, system configuration,
              cooling, and other factors not captured by this tool.
            </p>
            <p className="mt-2">
              Do not make purchase decisions solely based on this calculator's output. Always cross-reference
              with professional reviews and benchmarks from reputable hardware publications.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[--clr-text-primary] mb-2">3. Affiliate Disclosure</h2>
            <p>
              {SITE_NAME} participates in affiliate marketing programs including Amazon Associates, Newegg Affiliate,
              and B&H Photo Affiliate Program. We earn commissions when you purchase through affiliate links,
              at no additional cost to you. This does not influence our recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[--clr-text-primary] mb-2">4. Intellectual Property</h2>
            <p>
              The site's code, design, and content are owned by {SITE_NAME}. Hardware names, brand names,
              and product specifications are the property of their respective manufacturers
              (Intel, AMD, NVIDIA) and are used for identification and comparison purposes only.
              {SITE_NAME} is not affiliated with Intel, AMD, or NVIDIA.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[--clr-text-primary] mb-2">5. Limitation of Liability</h2>
            <p>
              {SITE_NAME} is provided "as is" without warranty of any kind. We are not liable for any
              damages arising from use of this site or purchase decisions made based on its output.
              Maximum liability is limited to zero dollars, as the service is provided free of charge.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[--clr-text-primary] mb-2">6. API Usage</h2>
            <p>
              The public API at /api/bottleneck is provided free up to 30 requests per minute.
              Commercial use or high-volume usage requires a paid API plan. Circumventing rate limits
              is grounds for IP ban.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[--clr-text-primary] mb-2">7. Changes to Terms</h2>
            <p>
              We may update these terms. Continued use of the site after changes constitutes acceptance.
              Significant changes will be announced on the blog.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
