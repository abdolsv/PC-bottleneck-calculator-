// components/ram/RamSearchList.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

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

// ─── Deduplicate client-side as a safety net ─────────────────────────────────
function deduplicateById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  return arr.filter(item => {
    if (!item.id || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const scoreColor = (score: number) =>
  score >= 80 ? '#00d4ff' : score >= 60 ? '#22d3a0' : score >= 40 ? '#f5a524' : '#ef4444'

const scoreLabel = (score: number) =>
  score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Below Average'

export default function RamSearchList({ initialItems }: { initialItems: RamItem[] }) {
  const [query, setQuery] = useState('')

  // Deduplicate once on mount
  const dedupedItems = useMemo(() => deduplicateById(initialItems), [initialItems])

  const filtered = useMemo(() => {
    if (!query.trim()) return dedupedItems
    const q = query.toLowerCase()
    return dedupedItems.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.brand.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q),
    )
  }, [query, dedupedItems])

  const totalSamples = dedupedItems.reduce((a, b) => a + b.samples, 0)
  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-8 md:space-y-10">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] to-transparent border border-[--clr-border] p-5 sm:p-8 md:p-10">
        <div className="max-w-2xl">
          <nav className="text-xs text-[--clr-text-muted] mb-4 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
            <span aria-hidden>›</span>
            <span className="text-[--clr-text-secondary]" aria-current="page">RAM Rankings</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            RAM Benchmark Rankings {currentYear}
          </h1>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-2">
            Real-world memory kit performance rankings based on{' '}
            <strong className="text-[--clr-text-primary]">{totalSamples.toLocaleString()}+</strong> benchmark
            samples. Compare DDR4 and DDR5 RAM kits side-by-side and find the best memory for gaming,
            content creation, and productivity in {currentYear}.
          </p>
          <p className="text-xs text-[--clr-text-muted] mb-6">
            Scores reflect read/write throughput, memory latency, and gaming FPS data from real user submissions.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--clr-text-muted] text-sm" aria-hidden>🔍</span>
            <input
              type="search"
              placeholder="Search by name, brand, or type (e.g., DDR5-6000, Corsair)…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search RAM kits"
              className="w-full bg-[--clr-bg] text-sm text-[--clr-text-primary] placeholder-[--clr-text-muted] border border-[--clr-border] focus:border-[--clr-accent] rounded-xl pl-9 pr-4 py-3 outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[--clr-text-muted] hover:text-[--clr-text-primary] transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Kits Ranked',        value: dedupedItems.length.toLocaleString() },
          { label: 'Benchmark Samples',  value: `${Math.round(totalSamples / 1000)}K+` },
          { label: 'Top Score',          value: `${Math.round(dedupedItems[0]?.score ?? 0)}/100` },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-lg sm:text-xl font-mono font-bold" style={{ color: '#00d4ff' }}>{value}</p>
            <p className="text-xs text-[--clr-text-muted] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="card p-8 sm:p-10 text-center text-[--clr-text-muted]">
          <p className="text-2xl mb-2">🔍</p>
          No results for <strong>&ldquo;{query}&rdquo;</strong>. Try a brand name or DDR type.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-[--clr-border] flex items-center justify-between gap-3">
            <h2 className="font-bold text-sm">Memory Kit Rankings</h2>
            <span className="text-xs text-[--clr-text-muted] tabular-nums">
              {query ? `${filtered.length} of ${dedupedItems.length}` : `${filtered.length}`} kits
            </span>
          </div>

          {/* Mobile: card list */}
          <ul className="divide-y divide-[--clr-border] sm:hidden" role="list">
            {filtered.map((item, i) => (
              <li key={item.id}>
                <Link
                  href={`/ram/${item.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[--clr-bg-elevated]/40 active:bg-[--clr-bg-elevated]/60 transition-colors"
                >
                  <span className="text-sm font-mono text-[--clr-text-muted] w-7 text-center flex-shrink-0">
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-[--clr-text-muted]">{item.brand} · {item.samples.toLocaleString()} samples</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-mono font-bold text-sm" style={{ color: scoreColor(item.score) }}>
                      {Math.round(item.score)}
                    </p>
                    <p className="text-[10px]" style={{ color: scoreColor(item.score) }}>
                      {scoreLabel(item.score)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--clr-border] bg-[--clr-bg-elevated]/60">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted] w-16">Rank</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted]">Memory Kit</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted] w-28">Score</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted] w-28 hidden md:table-cell">Samples</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[--clr-text-muted] w-28 hidden lg:table-cell">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--clr-border]">
                {filtered.map((item, i) => (
                  <tr key={item.id} className="hover:bg-[--clr-bg-elevated]/40 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-[--clr-text-muted]">
                      {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/ram/${item.id}`}
                        className="font-medium hover:text-[--clr-accent] transition-colors block"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-[--clr-text-muted] mt-0.5">{item.brand}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="font-mono font-bold text-sm" style={{ color: scoreColor(item.score) }}>
                        {Math.round(item.score)}
                      </span>
                      <span className="text-[--clr-text-muted] text-xs">/100</span>
                    </td>
                    <td className="px-5 py-3 text-center text-xs text-[--clr-text-muted] hidden md:table-cell tabular-nums">
                      {item.samples.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-center hidden lg:table-cell">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${scoreColor(item.score)}18`, color: scoreColor(item.score) }}
                      >
                        {scoreLabel(item.score)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SEO Content ───────────────────────────────────────────────── */}
      <div className="border-t border-[--clr-border] pt-8 grid md:grid-cols-2 gap-6 md:gap-8 text-sm text-[--clr-text-secondary] leading-relaxed">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[--clr-text-primary] mb-3">
            Why RAM Speed Matters for Gaming
          </h2>
          <p>
            Memory bandwidth and latency directly affect how quickly your CPU can access game data.
            AMD Ryzen processors are especially sensitive to RAM speed — DDR5-6000 CL30 is the sweet
            spot for AM5 platforms in {currentYear}, providing a 5–10% FPS uplift over DDR5-4800 in
            CPU-bound titles. Always enable XMP or EXPO in your BIOS to reach rated speeds.
          </p>
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[--clr-text-primary] mb-3">
            DDR4 vs DDR5 in {currentYear}
          </h2>
          <p>
            DDR5 platforms (Intel LGA1851, AMD AM5) now offer clear performance advantages at equivalent
            capacity. DDR5-6000 kits deliver better throughput than even DDR4-4000. For new builds in
            {' '}{currentYear}, DDR5 is recommended. Legacy DDR4 systems benefit most from tighter
            timings (CL14–16) at 3600 MHz.
          </p>
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[--clr-text-primary] mb-3">
            How We Score RAM Kits
          </h2>
          <p>
            Our benchmark index aggregates real-world user submissions covering sequential read/write
            speeds, random access latency, and in-game FPS impact. Scores are normalized to a 0–100
            scale and weighted toward gaming workloads. Higher samples means a more statistically
            reliable score.
          </p>
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[--clr-text-primary] mb-3">
            Single vs Dual Channel RAM
          </h2>
          <p>
            Running two sticks in matched slots (A2 + B2) doubles memory bus bandwidth and is one of
            the highest-value free upgrades available. A dual-channel DDR5-6000 kit consistently
            outperforms a single-channel DDR5-7200 stick in gaming benchmarks. Always check your
            motherboard manual for correct slot placement.
          </p>
        </div>
      </div>
    </div>
  )
}
