// app/cpu/[slug]/page.tsx
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

export function generateStaticParams() {
  return CPUs.map(cpu => ({ slug: cpu.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cpu = CPUs.find(c => c.id === slug)
  if (!cpu) return { title: 'CPU Not Found' }

  return {
    title: `${cpu.name} Bottleneck Calculator — Best GPU Pairings & Performance Guide 2025`,
    description: `Find the best GPU to pair with your ${cpu.name}. ${cpu.cores} cores, ${cpu.boostClock}GHz boost. Free CPU bottleneck analysis for every NVIDIA RTX and AMD Radeon GPU. Avoid wasted performance and build a perfectly balanced PC.`,
    keywords: [
      `${cpu.name.toLowerCase()} bottleneck`,
      `best gpu for ${cpu.name.toLowerCase()}`,
      `${cpu.id} bottleneck calculator`,
      `${cpu.name.toLowerCase()} gpu pairing`,
      `${cpu.name.toLowerCase()} gaming performance`,
      `${cpu.name.toLowerCase()} bottleneck test`,
      `${cpu.name.toLowerCase()} fps benchmark`,
      `${cpu.name.toLowerCase()} gaming build`,
      `${cpu.name.toLowerCase()} recommended gpu`,
      `${cpu.name.toLowerCase()} best gpu 2025`,
      `how to avoid cpu bottleneck ${cpu.name.toLowerCase()}`,
      `${cpu.name.toLowerCase()} 1440p gpu`,
      `${cpu.name.toLowerCase()} 4k gaming`,
      `${cpu.name.toLowerCase()} rtx pairing`,
      `pc bottleneck calculator cpu`,
      `cpu gpu bottleneck checker`,
      `gaming pc bottleneck fix`,
    ],
    alternates: { canonical: `${SITE_URL}/cpu/${slug}` },
    openGraph: {
      title: `${cpu.name} Bottleneck Calculator — Best GPU Pairings 2025`,
      description: `Find the best GPU for your ${cpu.name}. Free bottleneck analysis, FPS optimization tips, and expert build recommendations across 1080p, 1440p, and 4K gaming.`,
      url: `${SITE_URL}/cpu/${slug}`,
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

export default async function CpuPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cpu = CPUs.find(c => c.id === slug)
  if (!cpu) notFound()

  const gpuResults = Array.from(
    new Map(
      GPUs.map(gpu => [
        gpu.id,
        {
          gpu,
          result1080: calculateBottleneck(cpu, gpu, 'gaming-1080p', 16),
          result1440: calculateBottleneck(cpu, gpu, 'gaming-1440p', 16),
          result4k:   calculateBottleneck(cpu, gpu, 'gaming-4k', 16),
        },
      ])
    ).values()
  ).sort((a, b) => a.result1440.percentage - b.result1440.percentage)

  const bestMatches = gpuResults.slice(0, 5)
  const worstMatches = gpuResults.slice(-3).reverse()

  const topGpuName = bestMatches[0]?.gpu?.name || 'Compatible GPU'
  const topPct = bestMatches[0]?.result1440?.percentage ?? 0
  const topLabel = bestMatches[0]?.result1440?.label || 'Optimal'

  const avgBottleneck = Math.round(
    gpuResults.slice(0, 10).reduce((acc, r) => acc + r.result1440.percentage, 0) / 10
  )

  const tierLabel =
    cpu.tier >= 5 ? 'Enthusiast / HEDT'
    : cpu.tier >= 4 ? 'High-End Desktop'
    : cpu.tier >= 3 ? 'Mid-Range Performance'
    : cpu.tier >= 2 ? 'Entry-Level / Budget'
    : 'Legacy / Thin Client'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${cpu.name} Bottleneck Calculator — Best GPU Pairings 2025`,
    description: `GPU bottleneck analysis and performance guide for the ${cpu.name}`,
    dateModified: new Date().toISOString(),
    author: { '@type': 'Organization', name: 'PC Bottleneck Calculator' },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What GPU should I pair with the ${cpu.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The best GPU for the ${cpu.name} is the ${topGpuName}, producing a ${topPct}% bottleneck at 1440p — rated as ${topLabel}. This pairing ensures the CPU can feed the GPU fast enough to avoid idle pipeline stalls.`,
          },
        },
        {
          '@type': 'Question',
          name: `Is the ${cpu.name} good for gaming?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The ${cpu.name} is a ${tierLabel.toLowerCase()} processor with ${cpu.cores} cores, ${cpu.threads} threads, and a ${cpu.boostClock}GHz boost clock. With a benchmark score of ${cpu.benchmarkScore}/100, it is ${cpu.benchmarkScore >= 80 ? 'well-suited for flagship GPU pairings and competitive gaming workloads' : cpu.benchmarkScore >= 60 ? 'capable of driving mid-to-high-end GPUs effectively in most gaming scenarios' : 'best matched with entry-level to mid-range GPUs for smooth budget gaming'}. At higher resolutions like 4K, the CPU's role diminishes and even older processors can support modern GPUs without significant bottlenecks.`,
          },
        },
        {
          '@type': 'Question',
          name: `Does the ${cpu.name} bottleneck high-end GPUs?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `At 1080p, the ${cpu.name} can bottleneck high-end GPUs if its single-thread performance or core count lags behind modern standards. At 1440p and 4K, the GPU workload increases dramatically, making the ${cpu.name} far less likely to create a meaningful bottleneck. Our calculator shows specific bottleneck percentages for every GPU paired with the ${cpu.name} at all three resolutions.`,
          },
        },
        {
          '@type': 'Question',
          name: `How many cores does the ${cpu.name} have?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The ${cpu.name} features ${cpu.cores} physical cores and ${cpu.threads} threads, with a boost clock of ${cpu.boostClock}GHz and a TDP of ${cpu.tdp}W. It belongs to the ${cpu.generation} generation on the ${cpu.socket} platform.`,
          },
        },
      ],
    },
  }

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
          <Link href="/cpu" className="hover:text-[--clr-accent] transition-colors">CPUs</Link>
          <span aria-hidden>›</span>
          <span className="text-[--clr-text-secondary] truncate max-w-[200px]" aria-current="page">
            {cpu.name}
          </span>
        </nav>

        {/* ─── HERO ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] via-[--clr-bg-card] to-[--clr-bg] border border-[--clr-border] p-6 md:p-10 mb-8">
          {/* Decorative grid bg */}
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(239,68,68,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,.35)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
          {/* Glow blob */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[--clr-high]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Text block */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--clr-border-glow] bg-[--clr-bg] text-xs text-[--clr-text-secondary] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[--clr-high] animate-pulse" />
                {cpu.brand} · {cpu.generation} · {cpu.socket} · {tierLabel}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]">
                {cpu.name}
                <br />
                <span className="text-[--clr-accent]">Bottleneck</span>{' '}
                <span className="text-[--clr-text-secondary] font-light">Calculator</span>
              </h1>

              <p className="text-[--clr-text-secondary] text-sm md:text-base leading-relaxed mb-5">
                Discover the <strong className="text-[--clr-text-primary]">best GPU pairing</strong> for your{' '}
                <strong className="text-[--clr-text-primary]">{cpu.name}</strong>. Our real-time bottleneck
                engine tests every NVIDIA RTX and AMD Radeon graphics card across 1080p, 1440p, and 4K
                workloads — so you get maximum FPS with zero wasted hardware performance.
              </p>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/?cpu=${cpu.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[--clr-accent] text-[--clr-bg] text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[--clr-accent]/20"
                >
                  ⚡ Open Full Calculator
                </Link>
                <a
                  href="#best-gpu-matches"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[--clr-border] text-sm font-semibold hover:border-[--clr-accent]/40 hover:bg-[--clr-bg-elevated] transition-all"
                >
                  View Best GPUs ↓
                </a>
              </div>
            </div>

            {/* CPU Schematic */}
            <div className="w-full md:w-64 h-52 relative border border-[--clr-high]/20 bg-[--clr-bg] rounded-2xl flex items-center justify-center p-4 overflow-hidden shadow-2xl flex-shrink-0">
              <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />

              {/* CPU Die Package */}
              <div className="w-36 h-36 border border-[--clr-high]/30 rounded-xl flex items-center justify-center relative bg-[--clr-bg-elevated]/60 shadow-inner">
                {/* Pin grid pads — simulating LGA socket */}
                {[
                  'absolute -top-1.5 left-1/5', 'absolute -top-1.5 left-2/5',
                  'absolute -top-1.5 right-2/5', 'absolute -top-1.5 right-1/5',
                  'absolute -bottom-1.5 left-1/5', 'absolute -bottom-1.5 right-1/5',
                  'absolute top-1/5 -left-1.5', 'absolute bottom-1/5 -left-1.5',
                  'absolute top-1/5 -right-1.5', 'absolute bottom-1/5 -right-1.5',
                ].map((pos, i) => (
                  <span
                    key={i}
                    className={`${pos} w-1.5 h-1.5 border border-[--clr-high]/60 bg-[--clr-bg] rounded-[1px]`}
                  />
                ))}

                {/* Core cluster die */}
                <div className="w-24 h-24 border-2 border-dashed border-[--clr-high]/40 rounded-lg p-1.5 flex flex-wrap gap-1 items-center justify-center">
                  {Array.from({ length: Math.min(cpu.cores, 16) }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-sm border transition-all ${
                        cpu.cores <= 4 ? 'w-8 h-8' : cpu.cores <= 8 ? 'w-5 h-5' : 'w-3.5 h-3.5'
                      } ${
                        idx < Math.ceil(cpu.cores / 2)
                          ? 'bg-[--clr-high]/80 border-[--clr-high] shadow-[0_0_6px_rgba(239,68,68,0.5)] animate-pulse'
                          : 'border-[--clr-border] bg-[--clr-bg]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-2 left-3 font-mono text-[8px] text-[--clr-text-muted] uppercase tracking-widest">
                {cpu.benchmarkScore}/100 Score
              </div>
              <div className="absolute top-2 right-3 font-mono text-[9px] text-[--clr-high] font-bold tracking-wide">
                {cpu.socket}
              </div>
              <div className="absolute top-2 left-3 font-mono text-[8px] text-[--clr-text-muted]">
                {cpu.cores}C / {cpu.threads}T
              </div>
            </div>
          </div>
        </div>

        {/* ─── Quick Stats ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Cores / Threads', value: `${cpu.cores}C/${cpu.threads}T`, sub: 'Processing Units', icon: '🧠' },
            { label: 'Boost Clock',     value: `${cpu.boostClock}GHz`,           sub: 'Peak Frequency',  icon: '⚡' },
            { label: 'TDP',             value: `${cpu.tdp}W`,                    sub: 'Power Draw',      icon: '🔌' },
            { label: 'Score',           value: `${cpu.benchmarkScore}`,           sub: 'Benchmark Index', icon: '📊' },
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
              The top 10 GPUs paired with the <strong>{cpu.name}</strong> average a{' '}
              <strong className="text-[--clr-text-primary]">{avgBottleneck}% bottleneck</strong> at 1440p.
              The best match — <strong className="text-[--clr-text-primary]">{topGpuName}</strong> — scores just{' '}
              <strong className="text-[--clr-ok]">{topPct}%</strong>, rated{' '}
              <strong>{topLabel}</strong>. Upgrading to 1440p or 4K significantly reduces CPU dependency.
            </p>
          </div>
        </div>

        {/* ─── Amazon Box ─── */}
        <div className="card p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#f90]/20 bg-gradient-to-r from-[#f90]/5 to-transparent">
          <div className="min-w-0 text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
              <span className="text-lg">🛒</span>
              <p className="font-semibold text-sm">Shop the {cpu.name} on Amazon</p>
            </div>
            <p className="text-xs text-[--clr-text-secondary]">
              Compare prices, read verified buyer reviews, and find bundle deals from real PC builders.
            </p>
          </div>
          <AmazonButton query={cpu.name} className="flex-shrink-0 text-sm w-full sm:w-auto" />
        </div>

        {/* ─── Best GPU Matches ─── */}
        <section id="best-gpu-matches" className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <h2 className="text-2xl font-bold">
              🏆 Best GPUs for {cpu.name}
            </h2>
            <span className="text-xs text-[--clr-text-muted] bg-[--clr-bg-elevated] px-3 py-1 rounded-full border border-[--clr-border]">
              Ranked at 1440p
            </span>
          </div>
          <p className="text-sm text-[--clr-text-secondary] mb-6">
            These graphics cards produce the lowest bottleneck percentage when paired with the {cpu.name},
            allowing the GPU to run at maximum throughput while the CPU keeps up with frame delivery demands.
          </p>

          <div className="space-y-3">
            {bestMatches.map(({ gpu, result1440 }, i) => {
              const badge = ratingBadge[result1440.color] ?? { bg: '#8b90a420', label: result1440.label, icon: '·' }
              return (
                <Link
                  key={gpu.id}
                  href={`/build/${cpu.id}/${gpu.id}`}
                  className="card p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-[--clr-accent]/40 hover:shadow-lg hover:shadow-[--clr-accent]/5 transition-all group"
                >
                  {/* Rank + GPU info */}
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
                        {gpu.name}
                      </p>
                      <p className="text-xs text-[--clr-text-muted] mt-0.5 truncate">
                        {gpu.vram}GB VRAM · {gpu.brand} · Target: {gpu.targetResolution}
                      </p>
                    </div>
                  </div>

                  {/* Bar + Percentage */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Progress bar */}
                    <div className="w-28 hidden md:block">
                      <div className="flex justify-between text-[9px] text-[--clr-text-muted] mb-1">
                        <span>Bottleneck</span>
                        <span>{result1440.percentage}%</span>
                      </div>
                      <div className="w-full bg-[--clr-bg-elevated] rounded-full h-2">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(4, result1440.percentage))}%`,
                            backgroundColor: colorMap[result1440.color] ?? '#8b90a4',
                            boxShadow: `0 0 8px ${colorMap[result1440.color] ?? '#8b90a4'}60`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Badge */}
                    <div
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{
                        backgroundColor: badge.bg,
                        color: colorMap[result1440.color] ?? '#8b90a4',
                      }}
                    >
                      <span>{badge.icon}</span>
                      <span>{result1440.label}</span>
                    </div>

                    {/* Mobile pct */}
                    <div className="text-right min-w-[52px]">
                      <p
                        className="text-base font-mono font-black sm:hidden"
                        style={{ color: colorMap[result1440.color] ?? '#8b90a4' }}
                      >
                        {result1440.percentage}%
                      </p>
                      <p className="text-[10px] text-[--clr-text-muted] sm:hidden whitespace-nowrap">
                        {result1440.label}
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

        {/* ─── Avoid These GPUs ─── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <span className="text-red-400">⚠️</span> GPUs Bottlenecked by {cpu.name}
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            These high-end graphics cards are too powerful for the {cpu.name} to feed efficiently.
            The CPU becomes the bottleneck, leaving expensive GPU performance on the table.
          </p>
          <div className="space-y-2">
            {worstMatches.map(({ gpu, result1440 }) => (
              <div
                key={gpu.id}
                className="card p-4 flex items-center justify-between gap-4 border-red-500/10 bg-red-500/3 opacity-80"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{gpu.name}</p>
                  <p className="text-xs text-[--clr-text-muted]">{gpu.vram}GB VRAM · {gpu.brand}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-mono font-bold text-red-400">{result1440.percentage}%</p>
                  <p className="text-[10px] text-[--clr-text-muted]">{result1440.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Full GPU Compatibility Table ─── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-1">📊 Full GPU Compatibility Matrix</h2>
          <p className="text-sm text-[--clr-text-secondary] mb-6">
            Every GPU tested at 1080p, 1440p, and 4K with the {cpu.name}. Lower % = less bottleneck.
          </p>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[--clr-border] bg-[--clr-bg-elevated]/70">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">
                      Graphics Card
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">1080p</th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">1440p</th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">4K</th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">Rating</th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted] hidden lg:table-cell">Buy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--clr-border]">
                  {gpuResults.map(({ gpu, result1080, result1440, result4k }, rowIdx) => (
                    <tr
                      key={gpu.id}
                      className="hover:bg-[--clr-bg-elevated]/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {rowIdx < 3 && (
                            <span className="text-[10px]">{['🥇','🥈','🥉'][rowIdx]}</span>
                          )}
                          <div>
                            <Link
                              href={`/gpu/${gpu.id}`}
                              className="font-medium text-sm hover:text-[--clr-accent] transition-colors"
                            >
                              {gpu.name}
                            </Link>
                            <p className="text-[11px] text-[--clr-text-muted]">
                              {gpu.vram}GB VRAM · {gpu.targetResolution}
                            </p>
                          </div>
                        </div>
                      </td>
                      {[result1080, result1440, result4k].map((r, i) => (
                        <td
                          key={i}
                          className="px-4 py-3.5 text-center font-mono text-xs font-bold"
                          style={{ color: colorMap[r.color] ?? '#8b90a4' }}
                        >
                          {r.percentage}%
                        </td>
                      ))}
                      <td className="px-4 py-3.5 text-center">
                        <Link href={`/build/${cpu.id}/${gpu.id}`}>
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: `${colorMap[result1440.color] ?? '#8b90a4'}18`,
                              color: colorMap[result1440.color] ?? '#8b90a4',
                            }}
                          >
                            {result1440.label}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                        <AmazonButton
                          query={gpu.name}
                          label="Buy"
                          className="text-[10px] px-2 py-1 whitespace-nowrap"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {gpuResults.length > 20 && (
              <div className="px-4 py-4 border-t border-[--clr-border] text-center">
                <Link
                  href={`/?cpu=${cpu.id}`}
                  className="text-xs text-[--clr-accent] hover:underline"
                >
                  View all {gpuResults.length} GPUs in the full calculator →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── SEO Article Content ─── */}
        <article className="space-y-10 border-t border-[--clr-border] pt-10 mb-12 prose-sm max-w-none">

          {/* Section 1 — CPU Overview */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {cpu.name} Review & Gaming Performance Overview
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              The <strong className="text-[--clr-text-primary]">{cpu.name}</strong> is a{' '}
              <strong>{tierLabel.toLowerCase()}</strong> processor from{' '}
              <strong>{cpu.brand}</strong>, belonging to the <strong>{cpu.generation}</strong> generation.
              Built on the <strong>{cpu.socket}</strong> platform, it features{' '}
              <strong>{cpu.cores} physical cores</strong> and <strong>{cpu.threads} threads</strong>,
              with a peak boost clock of <strong>{cpu.boostClock}GHz</strong>. Its thermal design power
              of <strong>{cpu.tdp}W</strong> positions it as{' '}
              {cpu.tdp > 125 ? 'a power-hungry performance chip that demands robust cooling — preferably a 240mm or 360mm AIO liquid cooler' :
               cpu.tdp > 65 ? 'a balanced desktop processor compatible with quality tower air coolers or compact AIOs' :
               'an energy-efficient option ideal for small form-factor builds or budget-conscious setups'}.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed">
              With a CPU benchmark score of <strong>{cpu.benchmarkScore}/100</strong>, the {cpu.name}
              is best matched with{' '}
              {cpu.benchmarkScore >= 80
                ? 'flagship and high-end GPUs such as the RTX 4090, RTX 4080, and RX 7900 XTX — fully leveraging their shader power without creating a meaningful processor bottleneck'
                : cpu.benchmarkScore >= 60
                ? 'mid-to-high-end graphics cards including the RTX 4070, RTX 4060 Ti, and RX 7700 XT — delivering excellent 1440p gaming performance at a great value'
                : 'entry-level and mid-range GPUs like the RX 7600, RTX 4060, and Arc A770 — offering smooth 1080p gameplay and capable 1440p performance at budget-friendly prices'}.
            </p>
          </section>

          {/* Section 2 — What Is a GPU Bottleneck */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              What Is a GPU Bottleneck and Why the {cpu.name} Causes One
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              A <strong className="text-[--clr-text-primary]">GPU bottleneck</strong> (also called a
              CPU bottleneck from the GPU's perspective) occurs when the processor cannot supply game data —
              draw calls, physics results, AI outputs, animation transforms — to the GPU fast enough. The
              graphics card sits idle, waiting for the CPU to finish processing the next batch of commands.
              The result is lower actual FPS than the GPU is capable of, inconsistent frame pacing, and
              visible stuttering especially during action-heavy scenes.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              For the <strong>{cpu.name}</strong>, bottlenecks tend to manifest most severely at{' '}
              <strong>1080p</strong> — where the GPU renders relatively few pixels per frame and has significant
              spare capacity. At <strong>1440p</strong> and especially <strong>4K</strong>, the GPU's
              pixel-fill rate requirements skyrocket, consuming its shader arrays and making the CPU's frame
              delivery speed far less of a constraint. This is why our calculator shows dramatically lower
              bottleneck percentages as resolution increases.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed">
              Our bottleneck percentage scale: <strong className="text-[--clr-ok]" style={{color: colorMap['--clr-ok']}}>0–5% is Optimal</strong>,{' '}
              <strong className="text-[--clr-low]" style={{color: colorMap['--clr-low']}}>5–10% is Great</strong>,{' '}
              <strong style={{color: colorMap['--clr-medium']}}>10–20% is Moderate</strong>,{' '}
              <strong style={{color: colorMap['--clr-high']}}>20–30% is High</strong>, and{' '}
              <strong className="text-red-400">30%+ is Critical</strong>. Most users should target pairings
              below 15% for a smooth, balanced gaming experience without noticeable performance loss.
            </p>
          </section>

          {/* Section 3 — What to Look For in a GPU */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Best GPU for {cpu.name}: What Specs Actually Matter
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              When selecting a GPU to pair with the <strong>{cpu.name}</strong>, focus on these
              specifications to ensure a balanced, high-performance build:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                {
                  term: 'GPU Tier vs CPU Score Balance',
                  body: `The ${cpu.name} scores ${cpu.benchmarkScore}/100. Pairing it with a GPU scoring significantly above ${Math.min(100, cpu.benchmarkScore + 20)}/100 risks a CPU bottleneck, especially at 1080p. Use our compatibility table above to find GPUs within the balanced range.`,
                },
                {
                  term: 'VRAM Capacity',
                  body: `For 1080p gaming, 8GB VRAM is sufficient with the ${cpu.name}. For 1440p, 10–12GB is recommended for modern AAA titles with high texture packs. At 4K with ray tracing and DLSS Ultra Quality, 16GB+ VRAM ensures you are never GPU-memory limited.`,
                },
                {
                  term: 'Ray Tracing & AI Upscaling Support',
                  body: `NVIDIA RTX cards (3000/4000/5000 series) with Tensor Cores support DLSS 3 Frame Generation, effectively multiplying FPS output and reducing the CPU's per-frame workload. AMD RDNA 3/4 cards with FSR 3 offer similar benefits. Both technologies help alleviate CPU bottlenecks by generating synthetic frames.`,
                },
                {
                  term: 'Power Consumption & PSU Requirements',
                  body: `The ${cpu.name} draws ${cpu.tdp}W under full load. Add your GPU's TDP to estimate total system draw. A quality 80+ Gold or Platinum PSU with at least 150W headroom above combined TDP ensures stable, long-term operation and protects your investment.`,
                },
                {
                  term: 'PCIe Generation',
                  body: `The ${cpu.socket} platform supports PCIe Gen 4 or Gen 5, depending on the chipset. High-bandwidth GPUs (RTX 4090, RX 7900 XTX) benefit from PCIe 4.0 x16 or better. On older platforms with PCIe 3.0, bandwidth limitations can add marginal performance overhead on the most powerful cards.`,
                },
              ].map(({ term, body }) => (
                <li key={term} className="flex gap-3">
                  <span className="text-[--clr-accent] font-bold flex-shrink-0 mt-0.5">→</span>
                  <p className="text-[--clr-text-secondary] leading-relaxed text-sm">
                    <strong className="text-[--clr-text-primary]">{term}:</strong> {body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 — Resolution Guide */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {cpu.name} at 1080p vs 1440p vs 4K: How Resolution Affects Bottleneck
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                {
                  res: '1080p',
                  note: 'CPU-Heavy',
                  desc: `At 1080p, the ${cpu.name} is the primary performance limiter when paired with high-end GPUs. The graphics card finishes rendering frames quickly and sits idle. Competitive gamers targeting 240Hz+ will be most affected by CPU bottlenecks at this resolution.`,
                  color: '--clr-high',
                },
                {
                  res: '1440p',
                  note: 'Balanced',
                  desc: `1440p strikes the ideal balance for most ${cpu.name} pairings. GPU workload increases significantly, pulling utilization up and reducing idle wait time. Mid-range GPU pairings are nearly perfectly balanced at this resolution.`,
                  color: '--clr-low',
                },
                {
                  res: '4K',
                  note: 'GPU-Bound',
                  desc: `At 4K, the ${cpu.name} becomes nearly irrelevant as a bottleneck. The GPU's shader arrays are fully saturated by pixel-fill demands. Even if the CPU is older, the GPU will be the limiting factor — making 4K gaming very forgiving of CPU age.`,
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

          {/* Section 5 — How to Fix */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              How to Reduce CPU Bottleneck on the {cpu.name}
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              If our compatibility matrix shows a high bottleneck percentage for your GPU paired with the{' '}
              <strong>{cpu.name}</strong>, here are the most effective fixes ranked by impact and cost:
            </p>
            <ol className="space-y-3">
              {[
                { n: '1', title: 'Increase Your Gaming Resolution', body: `The fastest free fix. Switching from 1080p to 1440p shifts render work from the ${cpu.name} to the GPU, significantly reducing the bottleneck percentage with zero hardware cost. At 4K, the improvement is even more dramatic.` },
                { n: '2', title: 'Enable DLSS / FSR Frame Generation', body: `NVIDIA DLSS 3 and AMD FSR 3 Frame Generation insert AI-generated frames between rendered frames, doubling effective FPS without doubling CPU load. This effectively reduces the CPU's workload per displayed frame, alleviating bottleneck symptoms.` },
                { n: '3', title: 'Upgrade to a Faster CPU', body: `The most impactful long-term solution. Refer to our bottleneck matrix and identify which CPU tier eliminates the bottleneck for your target GPU. Prioritize high boost clocks, modern IPC architecture (Intel Arrow Lake, AMD Zen 5), and large L3 cache.` },
                { n: '4', title: 'Overclock the CPU (If Supported)', body: `Intel K-series and AMD Ryzen processors support overclocking. Pushing the ${cpu.name} beyond its stock boost can recover 5–15% bottleneck improvement in frequency-sensitive scenarios. Ensure adequate cooling and a compatible overclock-enabled motherboard.` },
                { n: '5', title: 'Optimize Windows & In-Game Settings', body: 'Enable Windows Game Mode, set power plan to High Performance or Balanced (not Power Saver), and close background apps. In-game, reducing crowd density, physics simulation quality, and shadow draw distance offloads CPU-heavy calculations and frees pipeline bandwidth for the GPU.' },
                { n: '6', title: 'Upgrade System RAM', body: `Insufficient or slow RAM creates a memory bottleneck that masquerades as a CPU bottleneck. For the ${cpu.name}, ensure at least 16GB of RAM. DDR5 platforms benefit from 6000MHz CL30 memory. DDR4 systems should target 3600MHz CL16 for optimal bandwidth.` },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-[--clr-accent]/15 border border-[--clr-accent]/30 text-[--clr-accent] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
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

          {/* Section 6 — Game Genre CPU Sensitivity */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {cpu.name} in Popular Game Genres — Bottleneck Sensitivity
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              Not all games stress the CPU equally. Here is how CPU bottlenecks from the{' '}
              <strong>{cpu.name}</strong> manifest across popular game genres:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  game: 'Competitive FPS',
                  examples: 'CS2, Valorant, Apex Legends, Overwatch 2',
                  sensitivity: 'Very High',
                  note: `These titles run at very high frame rates (144Hz to 360Hz+), requiring the CPU to process game logic extremely fast. The ${cpu.name}'s single-thread performance is critical here. Slower CPUs will hard-cap achievable FPS well below the GPU's capability.`,
                },
                {
                  game: 'Open-World Games',
                  examples: 'Cyberpunk 2077, Elden Ring, GTA VI, Starfield',
                  sensitivity: 'High',
                  note: `Dense NPC AI, physics simulation, and dynamic world streaming create heavy multi-core CPU loads. The ${cpu.name} should handle most open-world titles well at 1440p, though flagship GPUs may still experience minor pipeline stalls in the most populated city areas.`,
                },
                {
                  game: 'RTS / Strategy',
                  examples: 'Total War, Civilization VII, StarCraft II, AoE IV',
                  sensitivity: 'Extreme',
                  note: `Strategy games run almost entirely on the CPU for unit pathfinding, combat calculations, and economy logic. The GPU is rarely the bottleneck. Even the most powerful GPU paired with the ${cpu.name} may experience CPU-caused slowdowns in late-game large battles.`,
                },
                {
                  game: 'AAA Cinematic / Action',
                  examples: 'Alan Wake 2, Spider-Man 2, Indiana Jones, STALKER 2',
                  sensitivity: 'Low to Moderate',
                  note: `These shader-heavy titles with path tracing and ray tracing are primarily GPU-bound at 1440p and 4K. The ${cpu.name} is more than capable of supporting even flagship GPUs in these workloads without creating significant bottlenecks.`,
                },
              ].map(({ game, examples, sensitivity, note }) => (
                <div key={game} className="card p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm">{game}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      sensitivity === 'Extreme'        ? 'text-red-400 bg-red-400/10' :
                      sensitivity === 'Very High'      ? 'text-orange-400 bg-orange-400/10' :
                      sensitivity === 'High'           ? 'text-yellow-400 bg-yellow-400/10' :
                      'text-emerald-400 bg-emerald-400/10'
                    }`}>
                      {sensitivity}
                    </span>
                  </div>
                  <p className="text-[10px] text-[--clr-accent] mb-1.5">{examples}</p>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 — Platform Context */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {cpu.socket} Platform: Motherboard & Memory Recommendations
            </h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-3">
              The <strong>{cpu.name}</strong> uses the <strong>{cpu.socket}</strong> socket. Choosing
              the right motherboard and memory combination maximizes CPU throughput and reduces memory-related
              bottlenecks that can impact GPU frame delivery:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Chipset Selection',
                  body: cpu.socket.startsWith('AM5')
                    ? 'AMD AM5 motherboards span X870E (flagship), X870, B850, and B650 chipsets. For overclocking and full PCIe 5.0 support, X870E is recommended. B650 offers excellent value for non-overclockers.'
                    : cpu.socket.startsWith('LGA')
                    ? 'Intel LGA platforms include Z-series (overclocking), B-series (mainstream), and H-series (budget). Z790/Z890 chipsets unlock full memory overclocking and multi-GPU PCIe lane support.'
                    : `Ensure your ${cpu.socket} motherboard supports the correct VRM power delivery for the ${cpu.name}'s TDP rating under extended gaming loads.`,
                  icon: '🔲',
                },
                {
                  title: 'Memory Configuration',
                  body: cpu.socket.startsWith('AM5')
                    ? 'AMD AM5 with Zen 4/5 benefits enormously from DDR5-6000 CL30 in dual-channel. EXPO profiles simplify setup. Avoid going above DDR5-6400 without manual tuning as stability decreases sharply.'
                    : cpu.socket.startsWith('LGA1700') || cpu.socket.startsWith('LGA1851')
                    ? 'Intel 12th/13th/14th/Ultra Gen CPUs support both DDR4 and DDR5 (platform dependent). DDR5-6000+ CL30 is ideal. DDR4 systems should run 3600MHz CL16 for best latency.'
                    : 'Run dual-channel memory at rated XMP/EXPO speeds for optimal bandwidth. 16GB minimum for gaming; 32GB recommended for streaming or content creation alongside gaming.',
                  icon: '💾',
                },
              ].map(({ title, body, icon }) => (
                <div key={title} className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{icon}</span>
                    <p className="font-semibold text-sm">{title}</p>
                  </div>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions — {cpu.name}
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Is the ${cpu.name} good for gaming in 2025?`,
                  a: `The ${cpu.name} is a ${tierLabel.toLowerCase()} processor scoring ${cpu.benchmarkScore}/100 on our benchmark index. In 2025, it ${cpu.benchmarkScore >= 75 ? 'remains highly competitive and pairs well with flagship GPUs for top-tier 1440p and 4K gaming experiences' : cpu.benchmarkScore >= 55 ? 'is still a capable gaming CPU for mid-range GPU pairings, delivering smooth 1080p and playable 1440p performance in most titles' : 'is showing its age for modern AAA gaming, especially at 1080p with high-end GPUs. Upgrading to a newer architecture would yield meaningful gains in CPU-sensitive games'}. Our bottleneck calculator helps you find the exact GPU sweet spot for your current build.`,
                },
                {
                  q: `Does the ${cpu.name} bottleneck the RTX 4090?`,
                  a: `At 4K, the ${cpu.name} will not meaningfully bottleneck the RTX 4090 — the GPU's massive shader throughput is the limiting factor at that resolution. At 1440p, bottleneck severity depends on the specific game engine. At 1080p, a high bottleneck percentage is likely, with the CPU unable to feed the world's most powerful consumer GPU fast enough to realize its full frame rate potential. Check our compatibility matrix above for exact percentages.`,
                },
                {
                  q: `How much RAM do I need with the ${cpu.name}?`,
                  a: `16GB of dual-channel RAM is the minimum for modern gaming with the ${cpu.name}. 32GB is recommended if you stream, record footage, or run browser tabs alongside games. Memory speed matters: ${cpu.socket.startsWith('AM5') ? 'DDR5-6000 CL30 is the sweet spot for AM5 platforms' : 'DDR4-3600 CL16 or DDR5-6000 CL30 depending on your platform generation'} — faster memory reduces latency between the CPU and RAM, which can lower frame pacing variance in CPU-bound scenarios.`,
                },
                {
                  q: `What cooler does the ${cpu.name} need?`,
                  a: `With a ${cpu.tdp}W TDP, the ${cpu.name} requires ${cpu.tdp > 125 ? 'a high-performance cooler: a 240mm or 360mm AIO liquid cooler, or a premium dual-tower air cooler like the Noctua NH-D15 or be quiet! Dark Rock Pro 5, to maintain stable boost clocks under extended gaming sessions' : cpu.tdp > 65 ? 'a quality mid-range air cooler or 120mm–240mm AIO. A Noctua NH-U12S, DeepCool AK620, or similar offers ample thermal headroom' : 'a basic box cooler or compact air cooler. Most 65W-class coolers provide sufficient thermal headroom without throttling'}. Adequate cooling is essential for sustaining maximum boost frequency and preventing performance drops.`,
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

        {/* ─── Related CPU Links ─── */}
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4">Compare Other CPUs</h2>
          <div className="flex flex-wrap gap-2">
            {CPUs.filter(c => c.id !== cpu.id && c.tier === cpu.tier).slice(0, 8).map(c => (
              <Link
                key={c.id}
                href={`/cpu/${c.id}`}
                className="px-3 py-1.5 rounded-lg border border-[--clr-border] text-xs text-[--clr-text-secondary] hover:border-[--clr-accent]/40 hover:text-[--clr-accent] transition-all"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA Footer ─── */}
        <div className="card p-8 text-center bg-gradient-to-br from-[--clr-bg-elevated] to-[--clr-bg] border border-[--clr-accent]/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#00d4ff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10">
            <p className="text-2xl font-extrabold mb-2">
              Ready to Build Your Perfect Gaming PC?
            </p>
            <p className="text-[--clr-text-secondary] text-sm mb-6 max-w-md mx-auto">
              Use our full interactive calculator to test any CPU + GPU combination with custom RAM and
              resolution settings — get a precise bottleneck score in seconds, completely free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/?cpu=${cpu.id}`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[--clr-accent] text-[--clr-bg] font-extrabold text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-[--clr-accent]/25"
              >
                ⚡ Open Configuration Engine
              </Link>
              <Link
                href="/cpu"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-[--clr-border] text-sm font-semibold hover:border-[--clr-accent]/40 transition-all"
              >
                Browse All CPUs
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}
