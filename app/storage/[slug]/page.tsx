// app/storage/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AmazonButton } from '@/components/ui/AmazonButton'
import { SITE_URL } from '@/lib/constants'
import { Storages } from '@/lib/hardware-data'

export const dynamicParams = true

// Programmatic year generation to keep metadata automated and relevant
const currentYear = new Date().getFullYear()

// Static generation helper maps unique slugs safely
export function generateStaticParams() {
  const uniqueSlugs = Array.from(new Set(Storages.map((item) => item.id)))
  return uniqueSlugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = Storages.find((s) => s.id === slug)
  if (!item) return { title: 'Solid State Drive Not Found' }
  
  return {
    title: `${item.name} SSD Benchmark, Speed & Review (${currentYear})`,
    description: `Comprehensive diagnostic metrics for the ${item.name}. Benchmark score: ${Math.round(item.score)}/100 compiled from ${item.samples.toLocaleString()} real-world configurations. Analyze sequential read/write latency impacts for gaming builds in ${currentYear}.`,
    alternates: { canonical: `${SITE_URL}/storage/${slug}` },
    keywords: [
      `${item.brand} drive evaluation`,
      `${item.name} sequential speeds`,
      'NVMe SSD performance index',
      'PC load time analysis',
      'gaming drive upgrade option',
      `best storage hardware ${currentYear}`
    ]
  }
}

const scoreColor = (score: number) =>
  score >= 80 ? '#00d4ff' : score >= 60 ? '#22d3a0' : score >= 40 ? '#f5a524' : '#ef4444'

const scoreLabel = (score: number) =>
  score >= 80 ? 'Elite Performance Tier' : score >= 60 ? 'High-Speed Balanced Tier' : score >= 40 ? 'Mainstream Storage Tier' : 'Entry Value Tier'

export default async function StorageSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = Storages.find((s) => s.id === slug)
  if (!item) notFound()

  const sortedCollection = [...Storages].sort((a, b) => b.score - a.score)
  const rank = sortedCollection.findIndex((s) => s.id === slug) + 1
  
  // Filter duplicates from similar results by grouping unique item ids
  const similar = Storages
    .filter((s) => s.id !== item.id && s.brand === item.brand)
    .slice(0, 6)

  const color = scoreColor(item.score)
  const isNvme = item.name.toLowerCase().includes('m.2') ||
                 item.name.toLowerCase().includes('nvme') ||
                 item.name.toLowerCase().includes('sn') ||
                 item.name.toLowerCase().includes('t7') ||
                 item.name.toLowerCase().includes('980') ||
                 item.name.toLowerCase().includes('990') ||
                 item.name.toLowerCase().includes('9100')
  const driveType = isNvme ? 'NVMe M.2 SSD' : 'Solid State Drive (SSD)'

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb Structure */}
        <nav className="text-xs text-[--clr-text-muted] mb-6 flex items-center gap-2 flex-wrap bg-[--clr-bg-elevated]/30 px-3 py-2 rounded-lg border border-[--clr-border]/40 w-fit">
          <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/storage" className="hover:text-[--clr-accent] transition-colors">SSD Hardware Rankings</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary] truncate max-w-[180px] font-medium">{item.name}</span>
        </nav>

        {/* Responsive Layout Layout Grid (Splits into Main content and Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Structural Detail Block */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] via-[--clr-bg-card] to-[--clr-bg] border border-[--clr-border] p-6 md:p-8">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                   style={{ background: color, opacity: 0.05 }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[--clr-border-glow] bg-[--clr-bg] text-xs text-[--clr-text-secondary] mb-4">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
                  {item.brand} Hardware Archive · Ranked #{item.rank !== 999 ? item.rank : rank} of {Storages.length}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-4 leading-snug text-[--clr-text-primary]">
                  {item.name}
                </h1>
                <p className="text-sm text-[--clr-text-secondary] leading-relaxed">
                  Real-time storage architecture tracking telemetry parsed exactly <strong className="text-[--clr-text-primary]">{item.samples.toLocaleString()} discrete user configurations</strong>. Use these system analytics to predict how changing your primary system cache modifies data streaming speed, load windows, and interface bottlenecks.
                </p>
              </div>
            </div>

            {/* Quick-Glance Data Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Manufacturer', value: item.brand, icon: '🏷️' },
                { label: 'Global Ranking', value: `#${item.rank !== 999 ? item.rank : rank}`, icon: '📊' },
                { label: 'Drive Interface', value: driveType, icon: '💾' },
                { label: 'Telemetry Samples', value: item.samples.toLocaleString(), icon: '🔬' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="card p-4 rounded-xl border border-[--clr-border] bg-[--clr-bg-card] flex flex-col items-center text-center justify-center hover:scale-[1.02] transition-transform duration-200">
                  <span className="text-lg mb-1">{icon}</span>
                  <span className="text-base font-mono font-bold text-[--clr-text-primary] truncate max-w-full">{value}</span>
                  <span className="text-[10px] text-[--clr-text-muted] mt-1 uppercase tracking-wider font-semibold">{label}</span>
                </div>
              ))}
            </div>

            {/* Deep Rich Technical Text Node for SEO Authority */}
            <div className="card p-6 border border-[--clr-border] bg-[--clr-bg-card] rounded-xl">
              <h2 className="text-base font-bold mb-4 text-[--clr-text-primary]">Architectural Storage Evaluation & DirectStorage Capabilities</h2>
              <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-4">
                The <strong className="text-[--clr-text-primary]">{item.name}</strong> delivers a normalized processing bandwidth score of <strong style={{ color }}>{Math.round(item.score)} out of 100 points</strong> within our data collection indexes. This quantitative baseline scales continuous file sequencing throughput, IOPS responsiveness, and system boot limits during heavy read-write operations executed in <strong>{currentYear}</strong>.
              </p>
              <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-4">
                {item.score >= 80
                  ? 'Representing an elite-tier solid-state solution, this kit is highly optimized for complex computing cycles. It minimizes application asset loading times and provides the high performance required for modern DirectStorage gaming APIs, avoiding texture pop-in or asset streaming latency during runtime.'
                  : item.score >= 60
                  ? 'A premium mid-range solid-state configuration, this storage drive strikes an exceptional balance between capacity layout and continuous block data transfers. It handles complex read/write workloads, game installations, and workflow exports without introducing processing delays.'
                  : item.score >= 40
                  ? 'An operational entry-level solution built for standardized OS workloads and general file operations. While fully sufficient for mainstream tasks, matching this with massive file libraries or raw productivity streams could introduce minimal response pacing boundaries.'
                  : 'A legacy or value-focused option best matching budget assemblies or backup archives. Modern open-world game engines may experience slight storage latency limits under full asset streaming stress.'}
              </p>
              <div className="p-3 bg-[--clr-bg-elevated]/40 rounded-lg border border-[--clr-border]/60 text-xs text-[--clr-text-secondary] flex items-start gap-2.5">
                <span className="mt-0.5">⚠️</span>
                <p>
                  <strong>Hardware Compatibility Note:</strong> To make full use of the sequential transfer caps on NVMe architectures, establish the drive inside an optimized M.2 PCIe slot running directly through your CPU root lanes rather than your shared motherboard chipset links. This guarantees unrestricted lane availability.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Focus Modules */}
          <div className="space-y-6">
            {/* Main Telemetry Score Block */}
            <div className="p-6 rounded-2xl border bg-[--clr-bg-card] flex flex-col items-center text-center justify-center relative overflow-hidden"
                 style={{ borderColor: `${color}30` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: color }} />
              <span className="text-xs text-[--clr-text-muted] uppercase tracking-widest font-bold mb-2">Storage Efficiency Index</span>
              <span className="text-6xl font-mono font-black tracking-tighter" style={{ color }}>{Math.round(item.score)}</span>
              <span className="text-xs text-[--clr-text-muted] mt-1 font-semibold">Normalized Scale / 100</span>
              <span className="text-xs font-bold mt-4 px-4 py-1.5 rounded-full border"
                    style={{ background: `${color}10`, borderColor: `${color}25`, color }}>
                {scoreLabel(item.score)}
              </span>
            </div>

            {/* Amazon Purchase Affiliation Panel */}
            <div className="card p-5 rounded-xl border border-[#f90]/20 bg-gradient-to-b from-[#f90]/5 to-transparent space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[--clr-text-primary] mb-1">🛒 Verify Available Formats</h3>
                <p className="text-xs text-[--clr-text-secondary] leading-relaxed">Check current global vendor stock, total capacities (1TB, 2TB, 4TB), and secure buyer warranties.</p>
              </div>
              <AmazonButton query={item.name} className="w-full text-center py-2.5 rounded-lg text-xs font-bold shadow-sm" />
            </div>

            {/* Scale Comparison Meter */}
            <div className="card p-5 border border-[--clr-border] bg-[--clr-bg-card] rounded-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">Comparative Performance Tiers</h3>
              <div className="space-y-3.5">
                {[
                  { label: item.name, score: item.score, active: true },
                  { label: 'Elite Tier Storage (80+)', score: 87, active: false },
                  { label: 'Mid Tier Storage (60–79)', score: 68, active: false },
                  { label: 'Entry Tier Storage (40–59)', score: 46, active: false },
                ].map(({ label, score, active }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={active ? 'font-bold text-[--clr-accent] truncate max-w-[150px]' : 'text-[--clr-text-muted] truncate max-w-[150px]'}>{label}</span>
                      <span className="font-mono font-bold" style={{ color: active ? color : 'var(--clr-text-muted)' }}>{Math.round(score)}</span>
                    </div>
                    <div className="w-full bg-[--clr-bg-elevated] rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                           style={{ width: `${score}%`, backgroundColor: active ? color : 'rgba(var(--clr-border-rgb), 0.5)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Item Hardware Nodes Row */}
        {similar.length > 0 && (
          <section className="mt-10 border-t border-[--clr-border] pt-8">
            <h2 className="text-base font-bold mb-4 text-[--clr-text-primary]">Alternative {item.brand} Storage Solutions to Consider</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {similar.map(s => (
                <Link
                  key={s.id}
                  href={`/storage/${s.id}`}
                  className="group block p-4 rounded-xl border border-[--clr-border] bg-[--clr-bg-card] hover:border-[--clr-accent]/50 hover:bg-[--clr-bg-elevated]/20 transition-all duration-200"
                >
                  <p className="font-bold text-xs text-[--clr-text-primary] group-hover:text-[--clr-accent] transition-colors truncate">{s.name}</p>
                  <div className="flex items-center justify-between mt-3 text-[11px]">
                    <span className="text-[--clr-text-muted] font-medium">{s.samples.toLocaleString()} configurations</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${scoreColor(s.score)}15`, color: scoreColor(s.score) }}>
                      {Math.round(s.score)}/100
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Global Bottleneck Calculator CTA Box */}
        <div className="card p-6 mt-8 rounded-xl text-center border border-[--clr-accent]/20 bg-gradient-to-br from-[--clr-accent]/5 to-transparent flex flex-col items-center justify-center space-y-3">
          <h3 className="font-bold text-base text-[--clr-text-primary]">Calculate Component Bottleneck Impacts</h3>
          <p className="text-xs text-[--clr-text-secondary] max-w-xl leading-relaxed">
            Your system performance depends on all parts working together. Pair this drive setup alongside your specific CPU module and graphics hardware configurations to map out real bottleneck configurations across all gameplay matrices.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[--clr-accent] text-[--clr-bg] font-bold text-xs hover:opacity-95 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md"
          >
            ⚡ Launch Full Bottleneck Calculator
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
