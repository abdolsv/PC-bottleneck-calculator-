// app/cpu/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'CPU Bottleneck Calculator — All Processors',
  description: 'Find the best GPU pairing for any CPU. Bottleneck analysis for Intel and AMD processors — i5, i7, i9, Ryzen 5, 7, 9 and more.',
  alternates: { canonical: `${SITE_URL}/cpu` },
}

const intelCpus = CPUs.filter(c => c.brand === 'Intel').sort((a, b) => b.benchmarkScore - a.benchmarkScore)
const amdCpus   = CPUs.filter(c => c.brand === 'AMD').sort((a, b) => b.benchmarkScore - a.benchmarkScore)

export default function CpuIndexPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10">
          <nav className="text-xs text-[--clr-text-muted] mb-4">
            <Link href="/" className="hover:text-[--clr-accent]">Home</Link>
            <span className="mx-2">›</span>
            <span>CPU Bottleneck Calculator</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2">CPU Bottleneck Calculator</h1>
          <p className="text-[--clr-text-secondary]">
            Select your processor to find the best GPU pairing and see which graphics cards
            will be bottlenecked by your CPU at 1080p, 1440p, and 4K.
          </p>
        </div>

        {[
          { brand: 'Intel', cpus: intelCpus, color: '--clr-accent', dot: '#00d4ff' },
          { brand: 'AMD',   cpus: amdCpus,   color: '--clr-high',   dot: '#ef4444' },
        ].map(({ brand, cpus, color, dot }) => (
          <section key={brand} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
              <h2 className="text-lg font-semibold">{brand}</h2>
              <span className="text-xs text-[--clr-text-muted]">{cpus.length} CPUs</span>
            </div>

            {/* Group by generation */}
            {Array.from(new Set(cpus.map(c => c.generation))).map(gen => (
              <div key={gen} className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted] mb-2 ml-1">
                  {gen}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {cpus.filter(c => c.generation === gen).map(cpu => (
                    <Link
                      key={cpu.id}
                      href={`/cpu/${cpu.id}`}
                      className="card p-4 hover:border-[--clr-border-glow] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm group-hover:text-[--clr-accent] transition-colors truncate">
                            {cpu.name}
                          </p>
                          <p className="text-xs text-[--clr-text-muted] mt-0.5">
                            {cpu.cores}C/{cpu.threads}T · {cpu.boostClock}GHz · {cpu.socket}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-mono font-bold" style={{ color: `var(${color})` }}>
                            {cpu.benchmarkScore}/100
                          </p>
                          <p className="text-[10px] text-[--clr-text-muted]">benchmark</p>
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-[--clr-bg-elevated] rounded-full h-1">
                        <div
                          className="h-full rounded-full opacity-60"
                          style={{ width: `${cpu.benchmarkScore}%`, backgroundColor: `var(${color})` }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </>
  )
}
