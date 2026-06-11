// app/build/[cpuId]/[gpuId]/page.tsx
//
// STATIC GENERATION STRATEGY (bandwidth-conscious):
// ─────────────────────────────────────────────────
// • Top 30 CPUs × top 25 GPUs = 750 combinations pre-built at deploy time.
//   We sort BOTH arrays by benchmarkScore descending before slicing so we
//   pre-build the pages users actually search for — not just the first 20
//   entries in the JSON file (which could be legacy low-score hardware).
// • Remaining ~169k+ combinations are ISR: generated on first crawl hit
//   from the sitemap, then edge-cached for 24 h. Netlify's CDN stale-while-
//   revalidate header serves the cached version even during a revalidation
//   window, so there is no bandwidth gap between deploys.
// • 750 pre-built pages adds ~30 seconds to build time — negligible cost
//   for eliminating cold starts on the most trafficked comparisons.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { calculateBottleneck } from '@/lib/bottleneck-engine'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AmazonButton } from '@/components/ui/AmazonButton'
import { SITE_URL } from '@/lib/constants'

// ─── ISR: cache for 24 hours after first generation ──────────────────────────
export const revalidate = 86400

// ─── Allow any CPU×GPU slug to be generated on-demand if not pre-built ───────
export const dynamicParams = true

// ─── Pre-build the 750 highest-value combinations at deploy time ──────────────
// Sorting by benchmarkScore ensures we pick the most-searched modern hardware,
// not the arbitrary order they appear in cpus.json / gpus.json.
// 30 × 25 = 750 pages — high ROI, low build-time cost (~30 s extra).
export function generateStaticParams() {
  const topCpus = [...CPUs]
    .sort((a, b) => b.benchmarkScore - a.benchmarkScore)
    .slice(0, 30)

  const topGpus = [...GPUs]
    .sort((a, b) => b.benchmarkScore - a.benchmarkScore)
    .slice(0, 25)

  return topCpus.flatMap(cpu =>
    topGpus.map(gpu => ({
      cpuId: cpu.id,
      gpuId: gpu.id,
    }))
  )
}

interface Props {
  params: Promise<{ cpuId: string; gpuId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const cpu = CPUs.find(c => c.id === resolvedParams.cpuId)
  const gpu = GPUs.find(g => g.id === resolvedParams.gpuId)
  if (!cpu || !gpu) return {}

  const result = calculateBottleneck(cpu, gpu, 'gaming-1440p', 16)

  return {
    title: `${cpu.name} + ${gpu.name} Bottleneck — Is This a Good Combo?`,
    description: `${cpu.name} with ${gpu.name}: ${result.percentage}% bottleneck at 1440p gaming. ${result.label}. ${result.recommendation}`,
    keywords: [
      `${cpu.name.toLowerCase()} ${gpu.name.toLowerCase()} bottleneck`,
      `${cpu.id} ${gpu.id} bottleneck`,
      `${cpu.name.toLowerCase()} bottleneck ${gpu.name.toLowerCase()}`,
    ],
    alternates: { canonical: `${SITE_URL}/build/${cpu.id}/${gpu.id}` },
    openGraph: {
      title: `${cpu.name} + ${gpu.name} — Bottleneck Analysis`,
      description: `${result.percentage}% bottleneck · ${result.label}`,
    },
  }
}

const useCases = [
  { key: 'gaming-1080p' as const, label: '1080p Gaming' },
  { key: 'gaming-1440p' as const, label: '1440p Gaming' },
  { key: 'gaming-4k'    as const, label: '4K Gaming' },
  { key: 'streaming'    as const, label: 'Streaming' },
] as const

const colorMap: Record<string, string> = {
  '--clr-ok':       '#00d4ff',
  '--clr-low':      '#22d3a0',
  '--clr-medium':   '#f5a524',
  '--clr-high':     '#ef4444',
  '--clr-critical': '#ff2056',
}

export default async function BuildPage({ params }: Props) {
  const resolvedParams = await params
  const cpu = CPUs.find(c => c.id === resolvedParams.cpuId)
  const gpu = GPUs.find(g => g.id === resolvedParams.gpuId)
  if (!cpu || !gpu) notFound()

  const results = useCases.map(({ key, label }) => ({
    label,
    result: calculateBottleneck(cpu, gpu, key, 16),
  }))

  const primaryResult = results[1].result // 1440p as primary

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Does ${cpu.name} bottleneck ${gpu.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `At 1440p gaming, the ${cpu.name} paired with a ${gpu.name} shows a ${primaryResult.percentage}% bottleneck. This is classified as ${primaryResult.label}. ${primaryResult.recommendation}`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${cpu.name} good with ${gpu.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${cpu.name} (benchmark score: ${cpu.benchmarkScore}/100) and ${gpu.name} (benchmark score: ${gpu.benchmarkScore}/100) have an efficiency score of ${primaryResult.efficiencyScore}/100. ${primaryResult.efficiencyScore >= 80 ? 'This is an excellent pairing.' : primaryResult.efficiencyScore >= 60 ? 'This is a decent pairing with some inefficiency.' : 'There is a significant mismatch between these components.'}`,
        },
      },
    ],
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-[--clr-text-muted] mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[--clr-accent]">Home</Link>
          <span>›</span>
          <Link href="/cpu" className="hover:text-[--clr-accent]">CPUs</Link>
          <span>›</span>
          <Link href={`/cpu/${cpu.id}`} className="hover:text-[--clr-accent]">{cpu.name}</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary]">{gpu.name}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {cpu.name} + {gpu.name}
        </h1>
        <p className="text-[--clr-text-secondary] mb-8">
          Complete bottleneck analysis across all resolutions and use cases.
        </p>

        {/* Quick verdict */}
        <div
          className="card-elevated p-5 mb-8 border-l-4"
          style={{ borderLeftColor: colorMap[primaryResult.color] ?? '#8b90a4' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-[--clr-text-muted] uppercase tracking-widest mb-1">Verdict (1440p Gaming)</p>
              <p className="text-xl font-bold" style={{ color: colorMap[primaryResult.color] }}>
                {primaryResult.label}
              </p>
              <p className="text-sm text-[--clr-text-secondary] mt-1">{primaryResult.recommendation}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-4xl font-mono font-bold" style={{ color: colorMap[primaryResult.color] }}>
                {primaryResult.percentage}%
              </p>
              <p className="text-xs text-[--clr-text-muted]">bottleneck</p>
            </div>
          </div>
        </div>

        {/* Results table across use cases */}
        <h2 className="text-lg font-semibold mb-3">Bottleneck by Use Case</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {results.map(({ label, result }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{label}</p>
                <p className="font-mono text-sm font-bold" style={{ color: colorMap[result.color] }}>
                  {result.percentage}%
                </p>
              </div>
              <div className="w-full bg-[--clr-bg-elevated] rounded-full h-1.5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${result.percentage}%`,
                    backgroundColor: colorMap[result.color] ?? '#8b90a4',
                  }}
                />
              </div>
              <p className="text-xs text-[--clr-text-muted] mt-1.5">{result.label}</p>
            </div>
          ))}
        </div>

        {/* Component specs comparison */}
        <h2 className="text-lg font-semibold mb-3">Component Comparison</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="card p-4">
            <p className="text-xs text-[--clr-text-muted] mb-1">CPU</p>
            <p className="font-semibold mb-3">{cpu.name}</p>
            <div className="space-y-1.5 text-xs text-[--clr-text-secondary]">
              <div className="flex justify-between"><span>Cores/Threads</span><span className="font-mono">{cpu.cores}C / {cpu.threads}T</span></div>
              <div className="flex justify-between"><span>Boost Clock</span><span className="font-mono">{cpu.boostClock} GHz</span></div>
              <div className="flex justify-between"><span>TDP</span><span className="font-mono">{cpu.tdp}W</span></div>
              <div className="flex justify-between"><span>Socket</span><span className="font-mono">{cpu.socket}</span></div>
              <div className="flex justify-between"><span>Benchmark Score</span><span className="font-mono text-[--clr-accent]">{cpu.benchmarkScore}/100</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-[--clr-border]">
              <AmazonButton query={cpu.name} className="w-full text-sm" />
            </div>
          </div>
          <div className="card p-4">
            <p className="text-xs text-[--clr-text-muted] mb-1">GPU</p>
            <p className="font-semibold mb-3">{gpu.name}</p>
            <div className="space-y-1.5 text-xs text-[--clr-text-secondary]">
              <div className="flex justify-between"><span>VRAM</span><span className="font-mono">{gpu.vram}GB</span></div>
              <div className="flex justify-between"><span>TDP</span><span className="font-mono">{gpu.tdp}W</span></div>
              <div className="flex justify-between"><span>Target Res.</span><span className="font-mono">{gpu.targetResolution}</span></div>
              <div className="flex justify-between"><span>Release Year</span><span className="font-mono">{gpu.releaseYear}</span></div>
              <div className="flex justify-between"><span>Benchmark Score</span><span className="font-mono text-[--clr-ok]">{gpu.benchmarkScore}/100</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-[--clr-border]">
              <AmazonButton query={gpu.name} className="w-full text-sm" />
            </div>
          </div>
        </div>

        {/* FAQ section — SEO rich results */}
        <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>
        <div className="space-y-3 mb-10">
          {[
            {
              q: `Does ${cpu.name} bottleneck ${gpu.name}?`,
              a: `At 1440p gaming, this combination shows a ${primaryResult.percentage}% bottleneck (${primaryResult.label}). ${primaryResult.recommendation}`,
            },
            {
              q: `What is the efficiency score for ${cpu.name} + ${gpu.name}?`,
              a: `The build efficiency score is ${primaryResult.efficiencyScore}/100. ${primaryResult.efficiencyScore >= 85 ? 'Excellent — these components are very well matched.' : primaryResult.efficiencyScore >= 65 ? 'Good — minor inefficiency but nothing significant.' : 'Below average — one component is significantly underutilized.'}`,
            },
            {
              q: `Should I upgrade my ${primaryResult.bottlenecker === 'Balanced' ? 'CPU or GPU' : primaryResult.bottlenecker}?`,
              a: primaryResult.bottlenecker === 'Balanced'
                ? 'This is a balanced build — upgrade whichever component aligns with your workload, or invest in faster RAM or NVMe storage.'
                : `Upgrade your ${primaryResult.bottlenecker} first. It is the limiting component in this configuration.`,
            },
          ].map(({ q, a }, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-semibold text-sm mb-2">{q}</h3>
              <p className="text-sm text-[--clr-text-secondary]">{a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card p-6 text-center">
          <p className="text-sm text-[--clr-text-secondary] mb-4">
            Test this exact combination in the interactive calculator for more options:
          </p>
          <Link
            href={`/?cpu=${cpu.id}&gpu=${gpu.id}&use=gaming-1440p&ram=16`}
            className="inline-block px-6 py-3 rounded-[--radius-md] bg-[--clr-accent] text-[--clr-bg] font-semibold"
          >
            Open in Calculator →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
