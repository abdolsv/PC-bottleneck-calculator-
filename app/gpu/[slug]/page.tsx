// app/gpu/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GPUs, CPUs } from '@/lib/hardware-data'
import { calculateBottleneck } from '@/lib/bottleneck-engine'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_URL } from '@/lib/constants'

// ✅ Next.js 15: generateStaticParams stays the same
export function generateStaticParams() {
  return GPUs.map(gpu => ({ slug: gpu.id }))
}

// ✅ Next.js 15: params is now a Promise — must be async + await
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gpu = GPUs.find(g => g.id === slug)
  if (!gpu) return { title: 'GPU Not Found' }

  return {
    title: `${gpu.name} Bottleneck Calculator — Best CPU Pairings`,
    description: `Find the best CPU to pair with your ${gpu.name}. Avoid bottlenecks in ${gpu.targetResolution} gaming. Free bottleneck analysis for every Intel and AMD CPU.`,
    keywords: [
      `${gpu.name.toLowerCase()} bottleneck`,
      `best cpu for ${gpu.name.toLowerCase()}`,
      `${gpu.name.toLowerCase()} cpu pairing`,
      `${gpu.id} bottleneck`,
    ],
    alternates: { canonical: `${SITE_URL}/gpu/${slug}` },
    openGraph: {
      title: `${gpu.name} Bottleneck Calculator`,
      description: `Find the best CPU for ${gpu.name} — free bottleneck analysis.`,
      url: `${SITE_URL}/gpu/${slug}`,
    },
  }
}

const colorMap: Record<string, string> = {
  '--clr-ok': '#00d4ff', '--clr-low': '#22d3a0',
  '--clr-medium': '#f5a524', '--clr-high': '#ef4444', '--clr-critical': '#ff2056',
}

// ✅ Next.js 15: async function + await params
export default async function GpuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gpu = GPUs.find(g => g.id === slug)
  if (!gpu) notFound()

  const useCases = ['gaming-1080p', 'gaming-1440p', 'gaming-4k'] as const

  // Pre-calculate for all CPUs at 1440p
  const cpuResults = CPUs.map(cpu => ({
    cpu,
    result: calculateBottleneck(cpu, gpu, 'gaming-1440p', 16),
  })).sort((a, b) => a.result.percentage - b.result.percentage)

  // Best 5 matches
  const bestMatches = cpuResults.slice(0, 5)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${gpu.name} Bottleneck Calculator — Best CPU Pairings`,
    description: `CPU bottleneck analysis for the ${gpu.name}`,
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What CPU should I pair with the ${gpu.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The best CPU for the ${gpu.name} is the ${bestMatches[0].cpu.name}, which gives a ${bestMatches[0].result.percentage}% bottleneck — rated as ${bestMatches[0].result.label}.`,
          },
        },
      ],
    },
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
          <Link href="/gpu" className="hover:text-[--clr-accent] transition-colors">GPUs</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary]">{gpu.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--clr-border-glow] bg-[--clr-bg-card] text-xs text-[--clr-text-secondary] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[--clr-ok]" />
            {gpu.brand} · {gpu.vram}GB VRAM · Target: {gpu.targetResolution}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {gpu.name} <span className="text-[--clr-accent]">Bottleneck</span> Calculator
          </h1>
          <p className="text-[--clr-text-secondary] text-lg max-w-2xl">
            Find the best CPU to pair with your {gpu.name} and eliminate bottlenecks
            at {gpu.targetResolution}. Every Intel and AMD CPU benchmarked below.
          </p>
        </div>

        {/* GPU Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'VRAM', value: `${gpu.vram}GB` },
            { label: 'Power Draw', value: `${gpu.tdp}W` },
            { label: 'Target Res.', value: gpu.targetResolution },
            { label: 'Benchmark', value: `${gpu.benchmarkScore}/100` },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4 text-center">
              <p className="text-xl font-mono font-bold text-[--clr-accent]">{value}</p>
              <p className="text-xs text-[--clr-text-muted] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Best CPU Matches */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-1">
            Best CPU Matches for {gpu.name}
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            Sorted by lowest bottleneck at 1440p gaming · 16GB RAM
          </p>

          <div className="space-y-3">
            {bestMatches.map(({ cpu, result }, i) => (
              <Link
                key={cpu.id}
                href={`/build/${cpu.id}/${gpu.id}`}
                className="card p-5 flex items-center gap-4 hover:border-[--clr-border-glow] transition-all group"
              >
                {/* Rank */}
                <div className="w-8 h-8 rounded-full bg-[--clr-bg-elevated] border border-[--clr-border] flex items-center justify-center text-xs font-bold text-[--clr-text-muted] flex-shrink-0">
                  {i + 1}
                </div>
                {/* CPU info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm group-hover:text-[--clr-accent] transition-colors">
                    {cpu.name}
                  </p>
                  <p className="text-xs text-[--clr-text-muted] mt-0.5">
                    {cpu.cores} cores · {cpu.boostClock}GHz boost · {cpu.socket}
                  </p>
                </div>
                {/* Bar + percent */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-24 hidden sm:block">
                    <div className="w-full bg-[--clr-bg-elevated] rounded-full h-1.5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(2, result.percentage)}%`,
                          backgroundColor: colorMap[result.color] ?? '#8b90a4',
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-mono font-bold"
                      style={{ color: colorMap[result.color] ?? '#8b90a4' }}
                    >
                      {result.percentage}%
                    </p>
                    <p className="text-[10px] text-[--clr-text-muted]">{result.label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Full CPU comparison table */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-1">All CPU Compatibility</h2>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            Complete bottleneck analysis across all resolutions
          </p>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--clr-border] bg-[--clr-bg]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">CPU</th>
                    {useCases.map(uc => (
                      <th key={uc} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">
                        {uc.replace('gaming-', '')}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {cpuResults.map(({ cpu, result: mainResult }) => {
                    const allResults = useCases.map(uc => ({
                      uc,
                      r: calculateBottleneck(cpu, gpu, uc, 16),
                    }))
                    return (
                      <tr
                        key={cpu.id}
                        className="border-b border-[--clr-border] hover:bg-[--clr-bg-elevated] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link href={`/cpu/${cpu.id}`} className="font-medium hover:text-[--clr-accent] transition-colors">
                            {cpu.name}
                          </Link>
                          <p className="text-xs text-[--clr-text-muted]">{cpu.cores}C · {cpu.boostClock}GHz</p>
                        </td>
                        {allResults.map(({ uc, r }) => (
                          <td key={uc} className="px-4 py-3 text-center">
                            <span
                              className="text-xs font-mono font-bold"
                              style={{ color: colorMap[r.color] ?? '#8b90a4' }}
                            >
                              {r.percentage}%
                            </span>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: `${colorMap[mainResult.color] ?? '#8b90a4'}20`,
                              color: colorMap[mainResult.color] ?? '#8b90a4',
                            }}
                          >
                            {mainResult.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose-section space-y-4 mb-10 border-t border-[--clr-border] pt-8">
          <h2 className="text-xl font-semibold">
            Does Your CPU Bottleneck the {gpu.name}?
          </h2>
          <p className="text-[--clr-text-secondary] leading-relaxed">
            The {gpu.name} is a {gpu.tier >= 4 ? 'high-end' : gpu.tier >= 3 ? 'mid-range' : 'entry-level'} GPU
            with a benchmark score of {gpu.benchmarkScore}/100. At its target resolution of {gpu.targetResolution},
            the GPU is the dominant component — the CPU matters less the higher the resolution.
            At 1080p however, even this GPU can be CPU-limited by budget processors.
          </p>
          <p className="text-[--clr-text-secondary] leading-relaxed">
            A CPU bottleneck with the {gpu.name} means your GPU is sitting idle, waiting for
            the CPU to prepare the next frame. You may notice this as GPU usage dropping below 90%
            while your CPU runs near 100%. The solution is either to upgrade your CPU, reduce CPU-heavy
            game settings (NPC density, draw distance), or switch to a higher resolution where the GPU
            has more to do per frame.
          </p>
        </div>

        {/* CTA */}
        <div className="card p-6 text-center bg-[--clr-bg-elevated]">
          <p className="text-[--clr-text-secondary] mb-4 text-sm">
            Want a precise result for your exact CPU + {gpu.name} combination?
          </p>
          <Link
            href={`/?gpu=${gpu.id}`}
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
