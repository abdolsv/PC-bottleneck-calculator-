// app/gpu/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GPUs, CPUs } from '@/lib/hardware-data'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return GPUs.map(gpu => ({ slug: gpu.id }))
}

export function generateMetadata({ params }: Props): Metadata {
  const gpu = GPUs.find(g => g.id === params.slug)
  if (!gpu) return {}

  return {
    title: `${gpu.name} Bottleneck Calculator — Best CPU Pairings`,
    description: `Find the best CPU to pair with your ${gpu.name}. Avoid bottlenecks in ${gpu.targetResolution} gaming. Free bottleneck analysis for every Intel and AMD CPU.`,
    alternates: { canonical: `/gpu/${gpu.id}` },
  }
}

export default function GpuPage({ params }: Props) {
  const gpu = GPUs.find(g => g.id === params.slug)
  if (!gpu) notFound()

  // Pre-calculate bottleneck for this GPU with all CPUs (for the comparison table)
  // Imported from engine — shows a big comparison table which is great for SEO
  const bestMatches = CPUs
    .filter(cpu => Math.abs(cpu.benchmarkScore - gpu.benchmarkScore) < 20)
    .sort((a, b) => Math.abs(a.benchmarkScore - gpu.benchmarkScore) - Math.abs(b.benchmarkScore - gpu.benchmarkScore))
    .slice(0, 5)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${gpu.name} Bottleneck Calculator — Best CPU Pairings`,
    description: `CPU bottleneck analysis for the ${gpu.name}`,
  }

  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">
          {gpu.name} — Bottleneck Calculator
        </h1>
        <p className="text-[--clr-text-secondary] mb-8">
          Find the best CPU to pair with your {gpu.name} for {gpu.targetResolution} gaming.
          Below are the top-matched CPUs that give you a balanced build with minimal bottleneck.
        </p>

        <h2 className="text-xl font-semibold mb-4">Best CPU Matches</h2>
        <div className="space-y-3 mb-12">
          {bestMatches.map(cpu => {
            const delta = Math.abs(cpu.benchmarkScore - gpu.benchmarkScore)
            const matchPct = 100 - delta
            return (
              <div key={cpu.id} className="card p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{cpu.name}</p>
                  <p className="text-sm text-[--clr-text-secondary]">{cpu.cores} cores · {cpu.boostClock}GHz boost</p>
                </div>
                <div className="text-right">
                  <p className="text-[--clr-accent] font-mono font-semibold">{matchPct}% match</p>
                  <p className="text-xs text-[--clr-text-muted]">
                    {delta < 5 ? 'Near-perfect balance' : delta < 15 ? 'Good match' : 'Acceptable'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA to the main calculator */}
        <div className="card p-6 text-center">
          <p className="text-[--clr-text-secondary] mb-4">
            Want a precise bottleneck score for your exact CPU + {gpu.name} combination?
          </p>
          <a href="/" className="inline-block px-6 py-3 rounded-lg bg-[--clr-accent] text-[--clr-bg] font-semibold">
            Use the Full Calculator →
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
