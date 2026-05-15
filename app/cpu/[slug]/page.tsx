// app/cpu/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { calculateBottleneck } from '@/lib/bottleneck-engine'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return CPUs.map(cpu => ({ slug: cpu.id }))
}

export function generateMetadata({ params }: Props): Metadata {
  const cpu = CPUs.find(c => c.id === params.slug)
  if (!cpu) return {}
  return {
    title: `${cpu.name} Bottleneck Calculator — Best GPU Pairings`,
    description: `Find the best GPU to pair with your ${cpu.name}. Avoid bottlenecks at 1080p, 1440p, and 4K. Free bottleneck analysis for every NVIDIA and AMD GPU.`,
    alternates: { canonical: `/cpu/${cpu.id}` },
  }
}

export default function CpuPage({ params }: Props) {
  const cpu = CPUs.find(c => c.id === params.slug)
  if (!cpu) notFound()

  // Pre-calculate results for this CPU with common GPUs
  const gpuResults = GPUs.map(gpu => {
    const result = calculateBottleneck(cpu, gpu, 'gaming-1440p', 16)
    return { gpu, result }
  }).sort((a, b) => a.result.percentage - b.result.percentage)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${cpu.name} Bottleneck Calculator — Best GPU Pairings`,
  }

  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-[--clr-text-muted] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[--clr-accent]">Home</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary]">{cpu.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">{cpu.name} — Bottleneck Calculator</h1>
        <p className="text-[--clr-text-secondary] mb-2">
          Find the best GPU to pair with your {cpu.name} for 1440p gaming.
        </p>

        {/* CPU specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Cores', value: cpu.cores },
            { label: 'Boost Clock', value: `${cpu.boostClock} GHz` },
            { label: 'TDP', value: `${cpu.tdp}W` },
            { label: 'Benchmark Score', value: `${cpu.benchmarkScore}/100` },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4 text-center">
              <p className="text-lg font-mono font-bold text-[--clr-accent]">{value}</p>
              <p className="text-xs text-[--clr-text-muted]">{label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">GPU Compatibility at 1440p Gaming</h2>
        <div className="space-y-3 mb-12">
          {gpuResults.map(({ gpu, result }) => {
            const colorMap: Record<string, string> = {
              '--clr-ok': '#00d4ff', '--clr-low': '#22d3a0',
              '--clr-medium': '#f5a524', '--clr-high': '#ef4444', '--clr-critical': '#ff2056',
            }
            return (
              <Link key={gpu.id} href={`/gpu/${gpu.id}`} className="card p-4 flex items-center gap-4 hover:border-[--clr-border-glow] transition-all group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium group-hover:text-[--clr-accent] transition-colors">{gpu.name}</p>
                  <p className="text-xs text-[--clr-text-muted]">{gpu.vram}GB VRAM · {gpu.targetResolution}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-[--clr-bg-elevated] rounded-full h-1.5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${result.percentage}%`, backgroundColor: colorMap[result.color] ?? '#8b90a4' }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold w-12 text-right" style={{ color: colorMap[result.color] }}>
                    {result.percentage}%
                  </span>
                  <span className="text-xs text-[--clr-text-muted] w-16 hidden sm:block">{result.label}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="card p-6 text-center">
          <p className="text-[--clr-text-secondary] mb-4">
            Want a precise bottleneck score for your {cpu.name} + a specific GPU?
          </p>
          <Link href="/" className="inline-block px-6 py-3 rounded-[--radius-md] bg-[--clr-accent] text-[--clr-bg] font-semibold">
            Use the Full Calculator →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
