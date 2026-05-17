// app/gpu/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GPUs, CPUs } from '@/lib/hardware-data'
import { calculateBottleneck } from '@/lib/bottleneck-engine'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AmazonButton } from '@/components/ui/AmazonButton'
import { SITE_URL } from '@/lib/constants'

export function generateStaticParams() {
  return GPUs.map(gpu => ({ slug: gpu.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gpu = GPUs.find(g => g.id === slug)
  if (!gpu) return { title: 'GPU Not Found' }

  return {
    title: `${gpu.name} Bottleneck Calculator — Best CPU Pairings & Performance Analysis 2025`,
    description: `Find the best CPU to pair with your ${gpu.name}. Avoid costly CPU bottlenecks in ${gpu.targetResolution} gaming. Get free, instant bottleneck analysis for every Intel Core and AMD Ryzen processor. Maximize FPS, reduce frame drops, and build the perfect PC.`,
    keywords: [
      `${gpu.name.toLowerCase()} bottleneck`,
      `best cpu for ${gpu.name.toLowerCase()}`,
      `${gpu.name.toLowerCase()} cpu pairing`,
      `${gpu.id} bottleneck calculator`,
      `${gpu.name.toLowerCase()} cpu bottleneck test`,
      `${gpu.name.toLowerCase()} performance`,
      `${gpu.name.toLowerCase()} fps benchmark`,
      `${gpu.name.toLowerCase()} gaming build`,
      `${gpu.name.toLowerCase()} recommended cpu`,
      `${gpu.name.toLowerCase()} best pairing 2025`,
      `how to avoid gpu bottleneck ${gpu.name.toLowerCase()}`,
      `${gpu.name.toLowerCase()} 1440p build`,
      `${gpu.name.toLowerCase()} 4k gaming cpu`,
      `pc bottleneck calculator`,
      `cpu gpu bottleneck tool`,
      `gaming pc bottleneck fix`,
    ],
    alternates: { canonical: `${SITE_URL}/gpu/${slug}` },
    openGraph: {
      title: `${gpu.name} Bottleneck Calculator — Best CPU Pairings 2025`,
      description: `Find the best CPU for your ${gpu.name}. Free bottleneck analysis, FPS optimization tips, and expert build recommendations for ${gpu.targetResolution} gaming.`,
      url: `${SITE_URL}/gpu/${slug}`,
    },
  }
}

const colorMap: Record<string, string> = {
  '--clr-ok': '#00d4ff',
  '--clr-low': '#22d3a0',
  '--clr-medium': '#f5a524',
  '--clr-high': '#ef4444',
  '--clr-critical': '#ff2056',
}

const ratingBadge: Record<string, { bg: string; label: string; icon: string }> = {
  '--clr-ok': { bg: 'rgba(0,212,255,0.12)', label: 'Excellent', icon: '⚡' },
  '--clr-low': { bg: 'rgba(34,211,160,0.12)', label: 'Great', icon: '✓' },
  '--clr-medium': { bg: 'rgba(245,165,36,0.12)', label: 'Moderate', icon: '⚠' },
  '--clr-high': { bg: 'rgba(239,68,68,0.12)', label: 'High', icon: '↑' },
  '--clr-critical': { bg: 'rgba(255,32,86,0.12)', label: 'Critical', icon: '✕' },
}

export default async function GpuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gpu = GPUs.find(g => g.id === slug)
  if (!gpu) notFound()

  const useCases = ['gaming-1080p', 'gaming-1440p', 'gaming-4k'] as const

  const cpuResults = CPUs.map(cpu => ({
    cpu,
    result: calculateBottleneck(cpu, gpu, 'gaming-1440p', 16),
  })).sort((a, b) => a.result.percentage - b.result.percentage)

  const bestMatches = cpuResults.slice(0, 5)
  const worstMatches = cpuResults.slice(-3).reverse()

  const topCpuName = bestMatches[0]?.cpu?.name || 'Compatible Processor'
  const topPct = bestMatches[0]?.result?.percentage ?? 0
  const topLabel = bestMatches[0]?.result?.label || 'Optimal'

  const avgBottleneck = Math.round(
    cpuResults.slice(0, 10).reduce((acc, r) => acc + r.result.percentage, 0) / 10
  )

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${gpu.name} Bottleneck Calculator — Best CPU Pairings 2025`,
    description: `CPU bottleneck analysis and performance guide for the ${gpu.name}`,
    dateModified: new Date().toISOString(),
    author: { '@type': 'Organization', name: 'PC Bottleneck Calculator' },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What CPU should I pair with the ${gpu.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The best CPU for the ${gpu.name} is the ${topCpuName}, producing a ${topPct}% bottleneck at 1440p — rated as ${topLabel}. This pairing ensures the GPU can operate at peak efficiency without the CPU becoming a performance chokepoint.`,
          },
        },
        {
          '@type': 'Question',
          name: `Does the ${gpu.name} cause a bottleneck?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The ${gpu.name} is a ${gpu.tier >= 4 ? 'high-end' : gpu.tier >= 3 ? 'mid-range' : 'entry-level'} GPU. At ${gpu.targetResolution}, it shifts the rendering workload heavily onto the GPU's shader cores, which means weaker CPUs are less likely to bottleneck it at higher resolutions. Pairing it with a modern multi-core processor such as the ${topCpuName} is recommended for optimal performance.`,
          },
        },
        {
          '@type': 'Question',
          name: `What resolution is the ${gpu.name} best for?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The ${gpu.name} targets ${gpu.targetResolution} gaming based on its ${gpu.vram}GB VRAM configuration and compute benchmark index of ${gpu.benchmarkScore}/100. At ${gpu.targetResolution} or beyond, GPU workloads dominate and CPU bottlenecks become less pronounced.`,
          },
        },
        {
          '@type': 'Question',
          name: `How much VRAM does the ${gpu.name} have?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The ${gpu.name} features ${gpu.vram}GB of VRAM, making it ${gpu.vram >= 16 ? 'well-suited for 4K textures, ray tracing, and DLSS/FSR workloads' : gpu.vram >= 8 ? 'capable at 1440p with high texture settings and moderate ray tracing' : 'suitable for 1080p gaming and light creative workloads'}.`,
          },
        },
      ],
    },
  }

  const tierLabel =
    gpu.tier >= 5 ? 'Enthusiast / Flagship'
    : gpu.tier >= 4 ? 'High-End Gaming'
    : gpu.tier >= 3 ? 'Mid-Range Performance'
    : gpu.tier >= 2 ? 'Entry-Level / Budget'
    : 'Thin Client / Legacy'

  return (
    <>
      <JsonLd data={schema} />
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-14">

        {/* ─── Breadcrumb ─── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-[--clr-text-muted] mb-6 flex items-center gap-2 flex-wrap"
        >
          <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
          <span aria-hidden>›</span>
          <Link href="/gpu" className="hover:text-[--clr-accent] transition-colors">GPUs</Link>
          <span aria-hidden>›</span>
          <span className="text-[--clr-text-secondary] truncate max-w-[200px]" aria-current="page">
            {gpu.name}
          </span>
        </nav>

        {/* ─── HERO ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] via-[--clr-bg-card] to-[--clr-bg] border border-[--clr-border] p-6 md:p-10 mb-8">
          {/* Decorative grid bg */}
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(0,212,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,.4)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
          {/* Glow blob */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[--clr-accent]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Text block */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--clr-border-glow] bg-[--clr-bg] text-xs text-[--clr-text-secondary] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[--clr-ok] animate-pulse" />
                {gpu.brand} · {gpu.vram}GB VRAM · {tierLabel}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]">
                {gpu.name}
                <br />
                <span className="text-[--clr-accent]">Bottleneck</span>{' '}
                <span className="text-[--clr-text-secondary] font-light">Calculator</span>
              </h1>

              <p className="text-[--clr-text-secondary] text-sm md:text-base leading-relaxed mb-5">
                Discover the <strong className="text-[--clr-text-primary]">best CPU pairing</strong> for your{' '}
                <strong className="text-[--clr-text-primary]">{gpu.name}</strong>. Our real-time bottleneck
                engine benchmarks every Intel Core and AMD Ryzen processor across 1080p, 1440p, and 4K
                workloads so you can build a balanced, high-FPS gaming PC — no guesswork required.
              </p>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/?gpu=${gpu.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[--clr-accent] text-[--clr-bg] text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[--clr-accent]/20"
                >
                  ⚡ Open Full Calculator
                </Link>
                <a
                  href="#best-cpu-matches"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[--clr-border] text-sm font-semibold hover:border-[--clr-accent]/40 hover:bg-[--clr-bg-elevated] transition-all"
                >
                  View Best CPUs ↓
                </a>
              </div>
            </div>

            {/* GPU Schematic */}
            <div className="w-full md:w-64 h-52 relative border border-[--clr-accent]/20 bg-[--clr-bg] rounded-2xl flex items-center justify-center p-4 overflow-hidden shadow-2xl flex-shrink-0">
              <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />

              {/* GPU Die Package */}
              <div className="w-36 h-36 border border-[--clr-accent]/30 rounded-xl flex items-center justify-center relative bg-[--clr-bg-elevated]/60 shadow-inner">
                {/* Memory pads */}
                {[
                  'absolute -top-1.5 left-1/4', 'absolute -top-1.5 right-1/4',
                  'absolute -bottom-1.5 left-1/4', 'absolute -bottom-1.5 right-1/4',
                  'absolute top-1/4 -left-1.5', 'absolute bottom-1/4 -left-1.5',
                  'absolute top-1/4 -right-1.5', 'absolute bottom-1/4 -right-1.5',
                ].map((pos, i) => (
                  <span key={i} className={`${pos} w-2 h-2 border border-[--clr-accent]/60 bg-[--clr-bg] rounded-sm`} />
                ))}

                {/* Core die */}
                <div className="w-20 h-20 border-2 border-dashed border-[--clr-accent]/40 rounded-lg p-1 flex flex-wrap gap-1 items-center justify-center">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-sm border transition-all ${
                        idx === 4
                          ? 'bg-[--clr-accent] border-[--clr-accent] shadow-[0_0_12px_rgba(0,212,255,0.6)] animate-pulse'
                          : idx % 3 === 0
                          ? 'border-[--clr-accent]/30 bg-[--clr-accent]/5'
                          : 'border-[--clr-border] bg-[--clr-bg]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-2 left-3 font-mono text-[8px] text-[--clr-text-muted] uppercase tracking-widest">
                {gpu.benchmarkScore}/100 Compute
              </div>
              <div className="absolute top-2 right-3 font-mono text-[9px] text-[--clr-accent] font-bold tracking-wide">
                PCIe x16
              </div>
              <div className="absolute top-2 left-3 font-mono text-[8px] text-[--clr-text-muted]">
                {gpu.vram}GB VRAM
              </div>
            </div>
          </div>
        </div>

        {/* ─── Quick Stats ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'VRAM', value: `${gpu.vram}GB`, sub: 'Video Memory', icon: '💾' },
            { label: 'TDP', value: gpu.tdp > 0 ? `${gpu.tdp}W` : 'N/A', sub: 'Power Draw', icon: '🔌' },
            { label: 'Target', value: gpu.targetResolution, sub: 'Sweet Spot', icon: '🖥️' },
            { label: 'Score', value: `${gpu.benchmarkScore}`, sub: 'Compute Index', icon: '📊' },
          ].map(({ label, value, sub, icon }) => (
            <div
              key={label}
              className="card p-4 text-center hover:border-[--clr-accent]/30 transition-all hover:shadow-lg hover:shadow-[--clr-accent]/5 group"
            >
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-2xl font-mono font-bold text-[--clr-accent] group-hover:scale-105 transition-transform inline-block">
                {value}
              </p>
              <p className="text-[10px] text-[--clr-text-muted] mt-0.5 uppercase tracking-wider">{sub}</p>
            </div>
          ))}
        </div>

        {/* ─── Insight Banner ─── */}
        <div className="card p-5 mb-10 flex flex-col sm:flex-row items-center gap-4 border-l-4 border-[--clr-ok] bg-[--clr-ok]/5">
          <div className="text-3xl flex-shrink-0">💡</div>
          <div>
            <p className="font-semibold text-sm mb-1 text-[--clr-ok]">Quick Insight</p>
            <p className="text-xs text-[--clr-text-secondary] leading-relaxed">
              The top 10 CPUs paired with the <strong>{gpu.name}</strong> average a{' '}
              <strong className="text-[--clr-text-primary]">{avgBottleneck}% bottleneck</strong> at 1440p.
              The best match — <strong className="text-[--clr-text-primary]">{topCpuName}</strong> — scores just{' '}
              <strong className="text-[--clr-ok]">{topPct}%</strong>, rated{' '}
              <strong>{topLabel}</strong>. Higher resolution gaming reduces CPU dependency significantly.
            </p>
          </div>
        </div>

        {/* ─── Amazon Box ─── */}
        <div className="card p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#f90]/20 bg-gradient-to-r from-[#f90]/5 to-transparent">
          <div className="min-w-0 text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
              <span className="text-lg">🛒</span>
              <p className="font-semibold text-sm">Shop the {gpu.name} on Amazon</p>
            </div>
            <p className="text-xs text-[--clr-text-secondary]">
              Compare prices, check availability, and read verified buyer reviews from real gamers.
            </p>
          </div>
          <AmazonButton query={gpu.name} className="flex-shrink-0 text-sm w-full sm:w-auto" />
        </div>

        {/* ─── Best CPU Matches ─── */}
        <section id="best-cpu-matches" className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <h2 className="text-2xl font-bold">
              🏆 Best CPUs for {gpu.name}
            </h2>
            <span className="text-xs text-[--clr-text-muted] bg-[--clr-bg-elevated] px-3 py-1 rounded-full border border-[--clr-border]">
              Ranked at 1440p
            </span>
          </div>
          <p className="text-sm text-[--clr-text-secondary] mb-6">
            These processors deliver the lowest bottleneck percentage when paired with the {gpu.name}, letting
            your GPU run at maximum capacity and extract every frame from your games.
          </p>

          <div className="space-y-3">
            {bestMatches.map(({ cpu, result }, i) => {
              const badge = ratingBadge[result.color] ?? { bg: '#8b90a420', label: result.label, icon: '·' }
              return (
                <Link
                  key={cpu.id}
                  href={`/build/${cpu.id}/${gpu.id}`}
                  className="card p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-[--clr-accent]/40 hover:shadow-lg hover:shadow-[--clr-accent]/5 transition-all group"
                >
                  {/* Rank + CPU info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                        i === 0
                          ? 'bg-[--clr-accent] text-[--clr-bg] shadow-lg shadow-[--clr-accent]/30'
                          : 'bg-[--clr-bg-elevated] border border-[--clr-border] text-[--clr-text-muted]'
                      }`}
                    >
                      {i === 0 ? '⭐' : i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm group-hover:text-[--clr-accent] transition-colors truncate">
                        {cpu.name}
                      </p>
                      <p className="text-xs text-[--clr-text-muted] mt-0.5 truncate">
                        {cpu.cores} Cores · {cpu.boostClock}GHz Boost · {cpu.socket}
                      </p>
                    </div>
                  </div>

                  {/* Bar + Percentage */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Progress bar */}
                    <div className="w-28 hidden md:block">
                      <div className="flex justify-between text-[9px] text-[--clr-text-muted] mb-1">
                        <span>Bottleneck</span>
                        <span>{result.percentage}%</span>
                      </div>
                      <div className="w-full bg-[--clr-bg-elevated] rounded-full h-2">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(4, result.percentage))}%`,
                            backgroundColor: colorMap[result.color] ?? '#8b90a4',
                            boxShadow: `0 0 8px ${colorMap[result.color] ?? '#8b90a4'}60`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Badge */}
                    <div
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{
                        backgroundColor: badge.bg,
                        color: colorMap[result.color] ?? '#8b90a4',
                      }}
                    >
                      <span>{badge.icon}</span>
                      <span>{result.label}</span>
                    </div>

                    {/* Mobile pct */}
                    <div className="text-right min-w-[52px]">
                      <p
                        className="text-base font-mono font-black sm:hidden"
                        style={{ color: colorMap[result.color] ?? '#8b90a4' }}
                      >
                        {result.percentage}%
                      </p>
                      <p className="text-[10px] text-[--clr-text-muted] sm:hidden whitespace-nowrap">
                        {result.label}
                      </p>
                    </div>

                    <span className="text-[--clr-text-muted] text-xs group-hover:text-[--clr-accent] transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ─── Avoid These CPUs ─── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <span className="text-red-400">⚠️</span> CPUs to Avoid with {gpu.name}
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            These processors create severe bottlenecks — your {gpu.name} will sit idle waiting for the CPU,
            wasting its potential and leaving FPS on the table.
          </p>
          <div className="space-y-2">
            {worstMatches.map(({ cpu, result }) => (
              <div
                key={cpu.id}
                className="card p-4 flex items-center justify-between gap-4 border-red-500/10 bg-red-500/3 opacity-80"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{cpu.name}</p>
                  <p className="text-xs text-[--clr-text-muted]">{cpu.cores} Cores · {cpu.socket}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-mono font-bold text-red-400">{result.percentage}%</p>
                  <p className="text-[10px] text-[--clr-text-muted]">{result.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Full Performance Matrix ─── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-1">📊 Full CPU Compatibility Matrix</h2>
          <p className="text-sm text-[--clr-text-secondary] mb-6">
            Every CPU tested at 1080p, 1440p, and 4K with the {gpu.name}. Scroll horizontally on mobile.
          </p>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[--clr-border] bg-[--clr-bg-elevated]/70">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">
                      Processor
                    </th>
                    {useCases.map(uc => (
                      <th
                        key={uc}
                        className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]"
                      >
                        {uc.replace('gaming-', '')}
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--clr-border]">
                  {cpuResults.slice(0, 20).map(({ cpu, result: mainResult }, rowIdx) => {
                    const allResults = useCases.map(uc => ({
                      uc,
                      r: calculateBottleneck(cpu, gpu, uc, 16),
                    }))
                    return (
                      <tr
                        key={cpu.id}
                        className="hover:bg-[--clr-bg-elevated]/40 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {rowIdx < 3 && (
                              <span className="text-[10px]">{['🥇','🥈','🥉'][rowIdx]}</span>
                            )}
                            <div>
                              <Link
                                href={`/cpu/${cpu.id}`}
                                className="font-medium text-sm hover:text-[--clr-accent] transition-colors"
                              >
                                {cpu.name}
                              </Link>
                              <p className="text-[11px] text-[--clr-text-muted]">
                                {cpu.cores}C / {cpu.threads}T · {cpu.boostClock}GHz
                              </p>
                            </div>
                          </div>
                        </td>
                        {allResults.map(({ uc, r }) => (
                          <td
                            key={uc}
                            className="px-4 py-3.5 text-center font-mono text-xs font-bold"
                            style={{ color: colorMap[r.color] ?? '#8b90a4' }}
                          >
                            {r.percentage}%
                          </td>
                        ))}
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              backgroundColor: `${colorMap[mainResult.color] ?? '#8b90a4'}18`,
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

            {cpuResults.length > 20 && (
              <div className="px-4 py-4 border-t border-[--clr-border] text-center">
                <Link
                  href={`/?gpu=${gpu.id}`}
                  className="text-xs text-[--clr-accent] hover:underline"
                >
                  View all {cpuResults.length} CPUs in the full calculator →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── SEO Article Content (1,000+ words) ─── */}
        <article className="space-y-10 border-t border-[--clr-border] pt-10 mb-12 prose-sm max-w-none">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {gpu.name} Review & Performance Overview
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              The <strong className="text-[--clr-text-primary]">{gpu.name}</strong> is a{' '}
              <strong>{tierLabel.toLowerCase()}</strong> graphics card from{' '}
              <strong>{gpu.brand}</strong>, purpose-built to deliver smooth, high-fidelity gaming at{' '}
              <strong>{gpu.targetResolution}</strong> and beyond. Equipped with{' '}
              <strong>{gpu.vram}GB of dedicated VRAM</strong>, it handles texture-heavy AAA titles, ray-traced
              environments, and modern AI-upscaling workloads (DLSS 3 / AMD FSR 3) with confidence. Its
              thermal design power of <strong>{gpu.tdp}W</strong> places it firmly within{' '}
              {gpu.tdp > 300 ? 'enthusiast power envelopes, requiring a quality 850W+ PSU' :
               gpu.tdp > 200 ? 'mid-to-high power demands, comfortable with a 650–750W power supply' :
               'energy-efficient territory, perfect for compact or HTPC builds'}.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed">
              With a compute benchmark index of <strong>{gpu.benchmarkScore}/100</strong>, the {gpu.name} sits
              in the <strong>{tierLabel}</strong> tier of our GPU performance hierarchy. Whether you are a
              competitive esports player chasing high refresh rates at 1080p, a content creator demanding
              4K texture fidelity, or a mainstream gamer who wants the best 1440p experience, understanding
              how to avoid CPU bottlenecks is critical to unlocking the GPU's true potential.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              What Is a CPU Bottleneck and Why Does It Matter?
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              A <strong className="text-[--clr-text-primary]">CPU bottleneck</strong> occurs when your
              processor cannot prepare and deliver frames to the GPU fast enough, forcing the graphics card to
              sit idle and wait. The result is lower-than-expected FPS, stuttering, frame time spikes, and a
              feeling that your expensive GPU is not delivering the performance you paid for. In modern games,
              the CPU handles AI logic, physics simulation, draw call management, and game engine threading —
              tasks that become more demanding in open-world titles with many NPCs and dynamic events.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              Our bottleneck calculator quantifies this mismatch as a percentage. A result of{' '}
              <strong className="text-[--clr-ok]" style={{color: colorMap['--clr-ok']}}>0–5% is considered optimal</strong>,
              meaning the CPU and GPU are well-balanced. Results between{' '}
              <strong>5–15%</strong> are acceptable for most users, while anything above{' '}
              <strong className="text-red-400">25%</strong> indicates the CPU is meaningfully limiting GPU
              throughput and should be upgraded or replaced.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed">
              The good news for {gpu.name} owners is that at higher resolutions like{' '}
              <strong>{gpu.targetResolution}</strong>, the GPU becomes the dominant workload. More pixels
              mean more shader computations per frame, which means the CPU's role shrinks proportionally. This
              is why pairing the {gpu.name} with a mid-range modern CPU at 1440p often yields results
              indistinguishable from pairing it with a flagship CPU — the GPU is simply the bottleneck at that
              resolution, and that's perfectly fine.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Best CPU for {gpu.name}: What to Look For
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              When choosing a CPU to pair with the <strong>{gpu.name}</strong>, there are several key
              specifications to consider:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                { term: 'Core Count', body: `Modern games benefit from 6 to 16 cores. At ${gpu.targetResolution}, a 6-core CPU with strong single-thread performance typically eliminates CPU bottlenecks for the ${gpu.name}. Titles like Cyberpunk 2077, Microsoft Flight Simulator, and Starfield can leverage 8–12 cores effectively.` },
                { term: 'Boost Clock Speed', body: `Single-threaded game engines prioritize high IPC and high boost frequencies. Look for CPUs boosting above 4.5GHz for the best pairing with the ${gpu.name}, especially at 1080p where CPU dependency is highest.` },
                { term: 'Socket & Platform', body: `Ensure CPU socket compatibility with your motherboard: Intel LGA1700/LGA1851 for Core 13th/14th/Ultra generation, or AMD AM5 for Ryzen 7000/8000/9000 series. Platform choice also affects memory support — DDR5 platforms offer lower latency benefits in CPU-bound scenarios.` },
                { term: 'Cache Size', body: `L3 cache is increasingly important for gaming. AMD's 3D V-Cache (X3D) processors like the Ryzen 7 7800X3D dramatically improve CPU-limited scenarios by keeping more game data closer to the cores, effectively reducing pipeline stalls.` },
              ].map(({ term, body }) => (
                <li key={term} className="flex gap-3">
                  <span className="text-[--clr-accent] font-bold flex-shrink-0">→</span>
                  <p className="text-[--clr-text-secondary] leading-relaxed text-sm">
                    <strong className="text-[--clr-text-primary]">{term}:</strong> {body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {gpu.name} at 1080p vs 1440p vs 4K: CPU Dependency Explained
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                {
                  res: '1080p',
                  note: 'CPU-heavy',
                  desc: `At 1080p, the ${gpu.name} renders relatively few pixels per frame, leaving significant GPU headroom. This makes the CPU the primary performance constraint. Competitive gamers chasing 240Hz+ will notice CPU bottlenecks most at this resolution.`,
                  color: '--clr-high',
                },
                {
                  res: '1440p',
                  note: 'Balanced',
                  desc: `1440p is the sweet spot for the ${gpu.name}. GPU and CPU workloads balance well. A modern mid-range CPU is typically all you need to fully leverage the GPU's performance potential here.`,
                  color: '--clr-low',
                },
                {
                  res: '4K',
                  note: 'GPU-bound',
                  desc: `At 4K, the GPU is almost always the bottleneck. The massive pixel count keeps shader units busy, making CPU choice far less impactful. Even older CPUs can support the ${gpu.name} effectively at 4K without meaningful FPS loss.`,
                  color: '--clr-ok',
                },
              ].map(({ res, note, desc, color }) => (
                <div key={res} className="card p-4 border-t-2" style={{ borderTopColor: colorMap[color] }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{res}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: colorMap[color], backgroundColor: `${colorMap[color]}18` }}
                    >
                      {note}
                    </span>
                  </div>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              How to Fix a CPU Bottleneck with the {gpu.name}
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              If our calculator shows a high bottleneck percentage for your current CPU paired with the{' '}
              <strong>{gpu.name}</strong>, here are the most effective solutions ranked by impact:
            </p>
            <ol className="space-y-3">
              {[
                { n: '1', title: 'Upgrade to a Faster CPU', body: `The most direct solution. Refer to the Best CPU Matches table above to identify processors that drop below 10% bottleneck with the ${gpu.name}. Prioritize high single-thread performance and cache size.` },
                { n: '2', title: 'Increase Your Gaming Resolution', body: `If upgrading isn't immediately feasible, raising your resolution (e.g., from 1080p to 1440p) shifts load from the CPU to the GPU, effectively reducing the bottleneck percentage without any hardware purchase.` },
                { n: '3', title: 'Enable Game Mode & Disable Background Tasks', body: 'Windows Game Mode, disabling unnecessary startup applications, and closing browser tabs during gaming can free CPU threads for game use, marginally reducing observed bottlenecks.' },
                { n: '4', title: 'Overclock Your CPU', body: 'If your CPU is unlocked (Intel K-series, AMD Ryzen), overclocking can reduce bottleneck percentage by increasing clock speeds. Ensure proper cooling and stable voltage settings before attempting this.' },
                { n: '5', title: 'Optimize In-Game Settings', body: 'CPU-bound games often have specific settings that reduce CPU load: lowering simulation quality, crowd density, and draw distance reduces the number of objects the CPU must process per frame, freeing bandwidth for the GPU.' },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span
                    className="w-7 h-7 rounded-full bg-[--clr-accent]/15 border border-[--clr-accent]/30 text-[--clr-accent] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    {n}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-[--clr-text-primary] mb-0.5">{title}</p>
                    <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {gpu.name} in Popular Games — CPU Sensitivity Analysis
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              Different game engines place different demands on the CPU. Here is how CPU bottlenecks manifest
              across popular game categories when running the <strong>{gpu.name}</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { game: 'Open-World RPGs', examples: 'Cyberpunk 2077, Elden Ring, Hogwarts Legacy', sensitivity: 'High', note: 'Dense NPC logic and streaming world data are very CPU-intensive. Pair with a high-core-count CPU for smooth performance.' },
                { game: 'Competitive FPS', examples: 'CS2, Valorant, Apex Legends', sensitivity: 'Very High', note: 'These titles run at extremely high frame rates, exposing CPU bottlenecks most severely. A top-tier single-threaded CPU is critical.' },
                { game: 'Strategy Games', examples: 'Total War, Civilization VII, Age of Empires IV', sensitivity: 'Extreme', note: 'Unit AI calculations are almost entirely CPU-driven. The GPU is rarely the bottleneck in late-game scenarios.' },
                { game: 'AAA Action/Adventure', examples: 'Alan Wake 2, Spider-Man 2, Black Myth: Wukong', sensitivity: 'Moderate', note: 'GPU-heavy with ray tracing and path lighting. At 1440p+, the GPU dominates. CPU bottlenecks are mild with a modern processor.' },
              ].map(({ game, examples, sensitivity, note }) => (
                <div key={game} className="card p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm">{game}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      sensitivity === 'Extreme' ? 'text-red-400 bg-red-400/10' :
                      sensitivity === 'Very High' ? 'text-orange-400 bg-orange-400/10' :
                      sensitivity === 'High' ? 'text-yellow-400 bg-yellow-400/10' :
                      'text-[--clr-low] bg-[--clr-low]/10'
                    }`}
                    style={sensitivity === 'Moderate' ? {color: colorMap['--clr-low'], backgroundColor: `${colorMap['--clr-low']}18`} : {}}
                    >
                      CPU Sensitivity: {sensitivity}
                    </span>
                  </div>
                  <p className="text-[10px] text-[--clr-accent] mb-1.5">{examples}</p>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions — {gpu.name}
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Is the ${gpu.name} good for ${gpu.targetResolution} gaming?`,
                  a: `Yes. The ${gpu.name} is designed to deliver smooth, high-fidelity gameplay at ${gpu.targetResolution}. With ${gpu.vram}GB of VRAM, it handles modern AAA titles at high-to-ultra settings, supports ray tracing, and works seamlessly with DLSS 3 and AMD FSR 3 upscaling technologies to maintain target frame rates.`,
                },
                {
                  q: `Does RAM speed affect the ${gpu.name}'s bottleneck?`,
                  a: `Yes, RAM speed and latency influence CPU performance, which in turn affects bottleneck percentage. Faster DDR5 (6000MHz CL30) or DDR4 (3600MHz CL16) memory reduces memory bottlenecks and gives the CPU more bandwidth, marginally improving frame delivery to the GPU. The impact is most visible at 1080p in CPU-bound scenarios.`,
                },
                {
                  q: `What PSU wattage do I need for the ${gpu.name}?`,
                  a: `The ${gpu.name} has a TDP of ${gpu.tdp}W. When combined with a modern CPU (65–170W TDP) and other system components, a ${gpu.tdp > 300 ? '850W–1000W' : gpu.tdp > 200 ? '750W–850W' : '650W–750W'} 80+ Gold or Platinum rated PSU is recommended for stable, headroom-safe operation.`,
                },
                {
                  q: `How does our bottleneck calculator work?`,
                  a: `Our calculator uses a proprietary algorithm that factors in GPU compute performance (benchmark score), CPU single-thread IPC, core count, memory bandwidth, and the workload distribution at each resolution. Higher resolutions shift more work to the GPU's shader arrays, reducing CPU dependency. The output bottleneck percentage reflects the degree to which the CPU limits the GPU's effective throughput.`,
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="card group border border-[--clr-border] rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-semibold text-sm hover:text-[--clr-accent] transition-colors list-none">
                    <span>{q}</span>
                    <span className="text-[--clr-text-muted] text-lg flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

        </article>

        {/* ─── Related GPU Links ─── */}
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4">Compare Other GPUs</h2>
          <div className="flex flex-wrap gap-2">
            {GPUs.filter(g => g.id !== gpu.id && g.tier === gpu.tier).slice(0, 8).map(g => (
              <Link
                key={g.id}
                href={`/gpu/${g.id}`}
                className="px-3 py-1.5 rounded-lg border border-[--clr-border] text-xs text-[--clr-text-secondary] hover:border-[--clr-accent]/40 hover:text-[--clr-accent] transition-all"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA Footer ─── */}
        <div className="card p-8 text-center bg-gradient-to-br from-[--clr-bg-elevated] to-[--clr-bg] border border-[--clr-accent]/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#00d4ff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10">
            <p className="text-2xl font-extrabold mb-2">
              Ready to Build Your Perfect PC?
            </p>
            <p className="text-[--clr-text-secondary] text-sm mb-6 max-w-md mx-auto">
              Use our full interactive calculator to adjust RAM, resolution, and use-case — and get a precise
              bottleneck score for any CPU + GPU combination in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/?gpu=${gpu.id}`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[--clr-accent] text-[--clr-bg] font-extrabold text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-[--clr-accent]/25"
              >
                ⚡ Open Configuration Engine
              </Link>
              <Link
                href="/gpu"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-[--clr-border] text-sm font-semibold hover:border-[--clr-accent]/40 transition-all"
              >
                Browse All GPUs
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}
