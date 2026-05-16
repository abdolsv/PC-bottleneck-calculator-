// app/cpu/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { calculateBottleneck } from '@/lib/bottleneck-engine'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_URL } from '@/lib/constants'

export function generateStaticParams() {
  return CPUs.map(cpu => ({ slug: cpu.id }))
}

// ✅ Next.js 15: async + await params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cpu = CPUs.find(c => c.id === slug)
  if (!cpu) return { title: 'CPU Not Found' }

  return {
    title: `${cpu.name} Bottleneck Calculator — Best GPU Pairings`,
    description: `Find the best GPU to pair with your ${cpu.name}. ${cpu.cores} cores, ${cpu.boostClock}GHz boost. Free bottleneck analysis for every NVIDIA and AMD GPU.`,
    keywords: [
      `${cpu.name.toLowerCase()} bottleneck`,
      `best gpu for ${cpu.name.toLowerCase()}`,
      `${cpu.id} bottleneck calculator`,
    ],
    alternates: { canonical: `${SITE_URL}/cpu/${slug}` },
  }
}

const colorMap: Record<string, string> = {
  '--clr-ok': '#00d4ff', '--clr-low': '#22d3a0',
  '--clr-medium': '#f5a524', '--clr-high': '#ef4444', '--clr-critical': '#ff2056',
}

// ✅ Next.js 15: async + await params
export default async function CpuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cpu = CPUs.find(c => c.id === slug)
  if (!cpu) notFound()

  const gpuResults = GPUs.map(gpu => ({
    gpu,
    result1080: calculateBottleneck(cpu, gpu, 'gaming-1080p', 16),
    result1440: calculateBottleneck(cpu, gpu, 'gaming-1440p', 16),
    result4k:   calculateBottleneck(cpu, gpu, 'gaming-4k', 16),
  })).sort((a, b) => a.result1440.percentage - b.result1440.percentage)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${cpu.name} Bottleneck Calculator — Best GPU Pairings`,
    description: `GPU bottleneck analysis for the ${cpu.name}`,
  }

  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-[--clr-text-muted] mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/cpu" className="hover:text-[--clr-accent] transition-colors">CPUs</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary]">{cpu.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--clr-border-glow] bg-[--clr-bg-card] text-xs text-[--clr-text-secondary] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[--clr-high]" />
            {cpu.brand} · {cpu.generation} · {cpu.socket}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {cpu.name} <span className="text-[--clr-accent]">Bottleneck</span> Calculator
          </h1>
          <p className="text-[--clr-text-secondary] text-lg max-w-2xl">
            Find every GPU compatible with your {cpu.name} — see exactly which graphics cards
            will be bottlenecked, and which ones give you a perfectly balanced build.
          </p>
        </div>

        {/* CPU Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Cores / Threads', value: `${cpu.cores}C / ${cpu.threads}T` },
            { label: 'Boost Clock',     value: `${cpu.boostClock} GHz` },
            { label: 'TDP',             value: `${cpu.tdp}W` },
            { label: 'Benchmark',       value: `${cpu.benchmarkScore}/100` },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4 text-center">
              <p className="text-xl font-mono font-bold text-[--clr-accent]">{value}</p>
              <p className="text-xs text-[--clr-text-muted] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* GPU Compatibility Table */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-1">GPU Compatibility Table</h2>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            Bottleneck % at each resolution · 16GB RAM · Lower = better
          </p>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--clr-border] bg-[--clr-bg]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">GPU</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">1080p</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">1440p</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">4K</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {gpuResults.map(({ gpu, result1080, result1440, result4k }) => (
                    <tr
                      key={gpu.id}
                      className="border-b border-[--clr-border] hover:bg-[--clr-bg-elevated] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/gpu/${gpu.id}`} className="font-medium hover:text-[--clr-accent] transition-colors">
                          {gpu.name}
                        </Link>
                        <p className="text-xs text-[--clr-text-muted]">{gpu.vram}GB · {gpu.targetResolution}</p>
                      </td>
                      {[result1080, result1440, result4k].map((r, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          <span className="text-xs font-mono font-bold" style={{ color: colorMap[r.color] ?? '#8b90a4' }}>
                            {r.percentage}%
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <Link href={`/build/${cpu.id}/${gpu.id}`}>
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: `${colorMap[result1440.color] ?? '#8b90a4'}20`,
                              color: colorMap[result1440.color] ?? '#8b90a4',
                            }}
                          >
                            {result1440.label}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="space-y-4 mb-10 border-t border-[--clr-border] pt-8">
          <h2 className="text-xl font-semibold">
            {cpu.name} Gaming Performance Analysis
          </h2>
          <p className="text-[--clr-text-secondary] leading-relaxed">
            The {cpu.name} ({cpu.generation}, {cpu.cores} cores / {cpu.threads} threads,
            {cpu.boostClock}GHz boost) is a {cpu.tier >= 4 ? 'high-performance' : cpu.tier >= 3 ? 'mid-range' : 'budget'}
            {' '}processor with a benchmark score of {cpu.benchmarkScore}/100. It pairs well with
            {cpu.benchmarkScore >= 80 ? ' flagship and high-end GPUs' : cpu.benchmarkScore >= 60 ? ' mid to high-end GPUs' : ' entry-level GPUs'}.
          </p>
          <p className="text-[--clr-text-secondary] leading-relaxed">
            At 1080p gaming, CPU performance matters more — the GPU has less work per frame so the
            processor must supply frames faster. At 4K, the reverse is true: the GPU dominates and
            the {cpu.name} will rarely be the bottleneck even with a flagship graphics card.
          </p>
        </div>

        {/* CTA */}
        <div className="card p-6 text-center bg-[--clr-bg-elevated]">
          <p className="text-[--clr-text-secondary] mb-4 text-sm">
            Want a precise result for your exact {cpu.name} + GPU combination?
          </p>
          <Link
            href={`/?cpu=${cpu.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[--radius-md] bg-[--clr-accent] text-[--clr-bg] font-semibold hover:opacity-90 transition-opacity"
          >
            Open in Calculator →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
