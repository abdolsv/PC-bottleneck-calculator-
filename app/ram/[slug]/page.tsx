// app/ram/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AmazonButton } from '@/components/ui/AmazonButton'
import { SITE_URL } from '@/lib/constants'
import ramJson from '@/data/ram.json'

export const dynamicParams = true
export function generateStaticParams() { return [] }

interface RamItem {
  id: string
  name: string
  brand: string
  model: string
  score: number
  samples: number
  type: string
  rank: number
}

// ─── Deduplicate by id to prevent duplicate React keys ───────────────────────
function deduplicateById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  return arr.filter(item => {
    if (!item.id || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const allRam = deduplicateById(ramJson as RamItem[])

// ─── Programmatic current year — never hardcode ───────────────────────────────
const CURRENT_YEAR = new Date().getFullYear()

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = allRam.find(r => r.id === slug)
  if (!item) return { title: 'RAM Not Found' }

  const score = Math.round(item.score)
  const rank = allRam.findIndex(r => r.id === slug) + 1

  return {
    title: `${item.name} Benchmark Score & Review ${CURRENT_YEAR} — PC Bottleneck Calculator`,
    description: `${item.name} scores ${score}/100 based on ${item.samples.toLocaleString()} real-world tests. Ranked #${rank} of ${allRam.length} memory kits. See DDR speed, latency, and gaming FPS impact for your PC build.`,
    keywords: [
      item.name,
      item.brand,
      `${item.name} benchmark`,
      `${item.name} review`,
      `${item.name} speed`,
      `${item.brand} DDR5`,
      `best RAM ${CURRENT_YEAR}`,
      'RAM benchmark',
      'memory benchmark',
      'PC bottleneck calculator',
    ],
    alternates: { canonical: `${SITE_URL}/ram/${slug}` },
    openGraph: {
      title: `${item.name} — Score ${score}/100 · Rank #${rank}`,
      description: `Real-world benchmark results for ${item.name}. ${item.samples.toLocaleString()} samples. Find out if this RAM kit is a bottleneck in your build.`,
      url: `${SITE_URL}/ram/${slug}`,
      type: 'article',
    },
  }
}

const scoreColor = (score: number) =>
  score >= 80 ? '#00d4ff' : score >= 60 ? '#22d3a0' : score >= 40 ? '#f5a524' : '#ef4444'

const scoreLabel = (score: number) =>
  score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Below Average'

function parseRamSpec(name: string): { speed?: string; capacity?: string; latency?: string } {
  const speedMatch = name.match(/DDR[45][\s-]?([\d]+)/i)
  const capacityMatch = name.match(/(\d+\s*[xX]\s*\d+\s*[gG][bB]|\d+[gG][bB](?:\s*Kit)?)/i)
  const latencyMatch = name.match(/[Cc](\d{2})/i)
  return {
    speed: speedMatch ? speedMatch[0].toUpperCase().replace(/\s/g, '-') : undefined,
    capacity: capacityMatch ? capacityMatch[0] : undefined,
    latency: latencyMatch ? `CL${latencyMatch[1]}` : undefined,
  }
}

export default async function RamSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = allRam.find(r => r.id === slug)
  if (!item) notFound()

  const rank = allRam.findIndex(r => r.id === slug) + 1
  const color = scoreColor(item.score)
  const label = scoreLabel(item.score)
  const spec = parseRamSpec(item.name)

  // Similar kits — same brand, deduplicated source guarantees unique ids
  const similar = allRam
    .filter(r => r.id !== item.id && r.brand === item.brand)
    .slice(0, 6)

  // Top kits for context bar
  const tiers = [
    { label: 'Top Tier (80–100)', score: 85 },
    { label: 'Mid Tier (60–79)',  score: 65 },
    { label: 'Entry Tier (40–59)', score: 45 },
  ]

  // Structured data (JSON-LD) for rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    brand: { '@type': 'Brand', name: item.brand },
    description: `${item.name} memory kit benchmark score: ${Math.round(item.score)}/100 based on ${item.samples.toLocaleString()} real-world tests.`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (item.score / 20).toFixed(1),
      bestRating: '5',
      worstRating: '1',
      reviewCount: item.samples,
    },
  }

  return (
    <>
      <Header />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 w-full overflow-x-hidden">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-[--clr-text-muted] mb-6 flex items-center gap-1.5 flex-wrap whitespace-normal"
        >
          <Link href="/" className="hover:text-[--clr-accent] transition-colors whitespace-nowrap">Home</Link>
          <span aria-hidden className="select-none">›</span>
          <Link href="/ram" className="hover:text-[--clr-accent] transition-colors whitespace-nowrap">RAM Rankings</Link>
          <span aria-hidden className="select-none">›</span>
          <span className="text-[--clr-text-secondary] min-w-0 max-w-[140px] xs:max-w-[200px] sm:max-w-xs truncate block" aria-current="page">
            {item.name}
          </span>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] via-[--clr-bg-card] to-[--clr-bg] border border-[--clr-border] p-5 sm:p-8 md:p-10 mb-8">
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: color, opacity: 0.07 }}
            aria-hidden
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {/* Left/Main content wrapper */}
            <div className="min-w-0 md:col-span-2 lg:col-span-3 order-2 md:order-1 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--clr-border-glow] bg-[--clr-bg] text-xs text-[--clr-text-secondary] mb-4 flex-wrap max-w-full">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} aria-hidden />
                  <span className="truncate">{item.brand}</span>
                  <span className="text-[--clr-text-muted] select-none">·</span>
                  <span className="whitespace-nowrap">Memory Kit</span>
                  <span className="text-[--clr-text-muted] select-none">·</span>
                  <span className="whitespace-nowrap font-semibold text-[--clr-accent]">Rank #{rank}</span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 leading-tight text-[--clr-text-primary] overflow-wrap-anywhere">
                  {item.name}
                </h1>

                {/* Parsed spec pills */}
                {(spec.speed || spec.capacity || spec.latency) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {spec.speed && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[--clr-bg-elevated] border border-[--clr-border] text-[--clr-text-secondary] whitespace-nowrap">
                        {spec.speed}
                      </span>
                    )}
                    {spec.capacity && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[--clr-bg-elevated] border border-[--clr-border] text-[--clr-text-secondary] whitespace-nowrap">
                        {spec.capacity}
                      </span>
                    )}
                    {spec.latency && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[--clr-bg-elevated] border border-[--clr-border] text-[--clr-text-secondary] whitespace-nowrap">
                        {spec.latency}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-6">
                  Benchmark performance data based on{' '}
                  <strong className="text-[--clr-text-primary] whitespace-nowrap">{item.samples.toLocaleString()} real-world tests</strong>.
                  Use this score to understand how this RAM kit impacts your build's performance in gaming and productivity.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[--clr-accent] text-[--clr-bg] text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all w-full sm:w-auto text-center shadow-sm"
                >
                  ⚡ Check My Build
                </Link>
                <Link
                  href="/ram"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[--clr-border] text-sm font-semibold hover:bg-[--clr-bg-elevated] active:scale-[0.98] transition-all w-full sm:w-auto text-center"
                >
                  ← All RAM
                </Link>
              </div>
            </div>

            {/* Score card (Now right-aligned/top-stacked cleanly) */}
            <div
              className="md:col-span-1 order-1 md:order-2 text-center p-5 rounded-xl border bg-[--clr-bg] w-full flex flex-col justify-center items-center shadow-inner"
              style={{ borderColor: `${color}30` }}
            >
              <p className="text-[10px] text-[--clr-text-muted] uppercase tracking-widest font-bold mb-1">Score</p>
              <div className="flex items-baseline justify-center font-mono">
                <span className="text-5xl sm:text-6xl font-black tracking-tighter" style={{ color }}>
                  {Math.round(item.score)}
                </span>
                <span className="text-xs text-[--clr-text-muted] ml-0.5">/100</span>
              </div>
              
              <p
                className="text-xs font-bold mt-3 px-3 py-1 rounded-full w-full max-w-[140px] truncate text-center select-none"
                style={{ background: `${color}12`, color }}
              >
                {label}
              </p>
              <div className="w-full h-px bg-[--clr-border] my-3 opacity-60" />
              <p className="text-[11px] text-[--clr-text-muted] font-medium truncate max-w-full">
                Rank #{rank} <span className="opacity-40">of</span> {allRam.length}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Brand',   value: item.brand,                    icon: '🏷️' },
            { label: 'Rank',    value: `#${rank} / ${allRam.length}`, icon: '📊' },
            { label: 'Samples', value: item.samples.toLocaleString(), icon: '🔬' },
            { label: 'Score',   value: `${Math.round(item.score)}/100`, icon: '⚡' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card p-4 flex flex-col items-center justify-center min-w-0">
              <div className="text-xl mb-1" aria-hidden>{icon}</div>
              <p className="text-sm sm:text-base font-mono font-bold text-[--clr-accent] truncate w-full text-center">{value}</p>
              <p className="text-[10px] text-[--clr-text-muted] mt-0.5 uppercase tracking-wider font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Performance bar ───────────────────────────────────────────── */}
        <div className="card p-5 sm:p-6 mb-8">
          <h2 className="text-base sm:text-lg font-bold mb-4">Performance vs. Tier Benchmarks</h2>
          <div className="space-y-4">
            <div key="current-item">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-[--clr-text-primary] truncate pr-4">{item.name} (this kit)</span>
                <span className="font-mono font-bold shrink-0" style={{ color }}>{Math.round(item.score)}</span>
              </div>
              <div className="w-full bg-[--clr-bg-elevated] rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${item.score}%`, backgroundColor: color }}
                />
              </div>
            </div>

            {tiers.map(({ label: tierLabel, score: tierScore }) => (
              <div key={tierLabel}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[--clr-text-muted] truncate">{tierLabel}</span>
                  <span className="font-mono text-[#4e5266] shrink-0 font-bold">{tierScore}</span>
                </div>
                <div className="w-full bg-[--clr-bg-elevated] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${tierScore}%`, backgroundColor: '#2a2d38' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Amazon CTA ────────────────────────────────────────────────── */}
        <div className="card p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-[#f90]/20 bg-gradient-to-r from-[#f90]/5 to-transparent">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm mb-1">🛒 Shop {item.name} on Amazon</p>
            <p className="text-xs text-[--clr-text-secondary] leading-relaxed">
              Compare prices and check availability from verified sellers. Free shipping eligible.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto flex items-center justify-center">
            <AmazonButton query={item.name} className="text-sm w-full md:w-auto justify-center" />
          </div>
        </div>

        {/* ── What this score means ─────────────────────────────────────── */}
        <div className="card p-5 sm:p-6 mb-8">
          <h2 className="text-base sm:text-lg font-bold mb-4">
            What Does the {item.name} Benchmark Score Mean?
          </h2>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-3">
            The <strong className="text-[--clr-text-primary]">{item.name}</strong> earns a score of{' '}
            <strong style={{ color }}>{Math.round(item.score)}/100</strong> on our memory performance index,
            placing it at rank #{rank} out of {allRam.length} tested kits. The score aggregates real-world
            read/write throughput, memory latency, and gaming frame-rate data across{' '}
            {item.samples.toLocaleString()} user-submitted benchmark samples as of {CURRENT_YEAR}.
          </p>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-3">
            {item.score >= 80
              ? `This is a top-tier memory kit. It will not bottleneck any modern gaming or productivity workload in ${CURRENT_YEAR}. Ideal for pairing with flagship CPUs like Ryzen 9 7950X3D or Intel Core i9-14900K on high-refresh-rate displays.`
              : item.score >= 60
              ? `This is a solid mid-range memory kit. It handles 1080p and 1440p gaming, video streaming, and everyday productivity without issue — a strong balance of performance and price in ${CURRENT_YEAR}.`
              : item.score >= 40
              ? `This is an entry-level kit suitable for light gaming and everyday tasks. Consider upgrading if you plan to run memory-intensive workloads, enable Resizable BAR, or pair it with a high-end CPU.`
              : `This is a budget or older-generation kit. It may create a memory bottleneck in modern games and CPU-intensive applications. An upgrade to DDR5 would significantly improve system responsiveness.`}
          </p>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-3">
            <strong className="text-[--clr-text-primary]">XMP / EXPO:</strong> Always enable XMP (Intel)
            or EXPO (AMD) in your BIOS to run this kit at its advertised speed. Without XMP/EXPO, most
            DDR5 kits will default to 4800 MHz and DDR4 kits to 2133 MHz regardless of the rated spec
            printed on the label.
          </p>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed">
            <strong className="text-[--clr-text-primary]">Dual-channel matters:</strong> Running two sticks
            in the correct slots (typically A2 + B2) doubles your memory bus bandwidth compared to
            single-channel operation, translating to 10–30% higher FPS in CPU-bound titles like
            Cyberpunk 2077, Starfield, or Microsoft Flight Simulator.
          </p>
        </div>

        {/* ── SEO: Buying guide section ─────────────────────────────────── */}
        <div className="card p-5 sm:p-6 mb-8">
          <h2 className="text-base sm:text-lg font-bold mb-4">
            Is the {item.name} Right for Your Build?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-[--clr-text-secondary] leading-relaxed">
            <div>
              <h3 className="text-sm font-semibold text-[--clr-text-primary] mb-2">✅ Best Use Cases</h3>
              <ul className="space-y-1.5 list-disc list-inside marker:text-[--clr-text-muted]">
                {item.score >= 70 && <li>High-refresh gaming (144 Hz / 240 Hz)</li>}
                {item.score >= 60 && <li>1080p and 1440p gaming builds</li>}
                {item.score >= 50 && <li>General productivity and web browsing</li>}
                {item.score >= 40 && <li>Budget office and student PCs</li>}
                <li>Any build that needs {spec.capacity ?? 'ample'} RAM capacity</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[--clr-text-primary] mb-2">🔧 Compatible Platforms</h3>
              <ul className="space-y-1.5 list-disc list-inside marker:text-[--clr-text-muted]">
                {item.name.toUpperCase().includes('DDR5') ? (
                  <>
                    <li>Intel LGA1851 (Core Ultra / Arrow Lake)</li>
                    <li>Intel LGA1700 (Alder / Raptor Lake)</li>
                    <li>AMD AM5 (Ryzen 7000 / 9000 series)</li>
                  </>
                ) : (
                  <>
                    <li>Intel LGA1700 (12th–13th Gen)</li>
                    <li>AMD AM4 (Ryzen 5000 / 3000 series)</li>
                    <li>Intel LGA1200 (10th–11th Gen)</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Similar kits ──────────────────────────────────────────────── */}
        {similar.length > 0 && (
          <section className="mb-8" aria-label={`Other ${item.brand} memory kits`}>
            <h2 className="text-base sm:text-lg font-bold mb-4">Other {item.brand} Memory Kits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {similar.map(r => (
                <Link
                  key={r.id}
                  href={`/ram/${r.id}`}
                  className="card p-4 hover:border-[--clr-accent]/40 active:scale-[0.99] transition-all group min-w-0"
                >
                  <p className="font-medium text-sm group-hover:text-[--clr-accent] transition-colors truncate w-full">
                    {r.name}
                  </p>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <p className="text-xs text-[--clr-text-muted] truncate">{r.samples.toLocaleString()} samples</p>
                    <span
                      className="font-mono text-sm font-bold shrink-0"
                      style={{ color: scoreColor(r.score) }}
                    >
                      {Math.round(r.score)}/100
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <div className="card p-5 sm:p-6 text-center border border-[--clr-accent]/20 flex flex-col items-center">
          <p className="font-semibold mb-2">See How This RAM Affects Your Bottleneck</p>
          <p className="text-sm text-[--clr-text-secondary] mb-4 max-w-xl">
            Use our free calculator to test CPU + GPU + RAM combinations and find bottlenecks in your specific build.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[--clr-accent] text-[--bg] font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all w-full sm:w-auto"
          >
            ⚡ Open Bottleneck Calculator
          </Link>
        </div>

      </main>
      <Footer />
    </>
  )
}
