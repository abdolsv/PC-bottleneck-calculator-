// app/page.tsx
import type { Metadata } from 'next'
import BottleneckCalculator from '@/components/calculator/BottleneckCalculator'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'PC Bottleneck Calculator — Free CPU & GPU Compatibility Check',
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'CPU bottleneck analysis',
    'GPU bottleneck analysis',
    'Use-case specific calculation',
    'Upgrade recommendations',
  ],
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={webAppSchema} />
      <Header />
      <main id="main-content">
        {/* Hero section */}
        <section className="relative overflow-hidden pt-16 pb-8 px-4">
          <div className="circuit-bg absolute inset-0 opacity-30" />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--clr-border-glow] bg-[--clr-bg-card] text-xs text-[--clr-text-secondary] mb-6">
              <span className="w-2 h-2 rounded-full bg-[--clr-accent] animate-pulse" />
              Free · No signup · Instant results
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              PC Bottleneck{' '}
              <span className="glow-text">Calculator</span>
            </h1>
            <p className="text-lg text-[--clr-text-secondary] max-w-2xl mx-auto mb-8">
              Find out if your CPU is bottlenecking your GPU in seconds.
              Select your components, choose your use case, get instant analysis.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <BottleneckCalculator />
        </section>

        {/* SEO content section — important for ranking */}
        <section className="max-w-4xl mx-auto px-4 py-12 border-t border-[--clr-border]">
          <h2 className="text-2xl font-semibold mb-6">What is a PC Bottleneck?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-[--clr-text-secondary] leading-relaxed">
            <div>
              <h3 className="text-[--clr-text-primary] font-medium mb-2">Understanding Bottlenecking</h3>
              <p>
                A PC bottleneck occurs when one component limits the performance of another.
                The most common pairing is a slow CPU limiting a powerful GPU — the CPU cannot
                feed frames fast enough for the GPU to render, leaving expensive GPU performance unused.
              </p>
            </div>
            <div>
              <h3 className="text-[--clr-text-primary] font-medium mb-2">Why It Matters for Gaming</h3>
              <p>
                At 1080p, your CPU plays a larger role since the GPU has less work per frame.
                At 4K, the GPU becomes dominant and CPU matters less. Our calculator accounts
                for this with use-case specific weighting.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
