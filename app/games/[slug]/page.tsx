// app/games/[slug]/page.tsx
// Each page targets: "[game] PC requirements", "best GPU for [game]", "can I run [game]"
// With 40 games × top GPU picks = thousands of internal links generating authority

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GAMES, getGameById } from '@/lib/games-data'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { estimateFps, canRunGame } from '@/lib/fps-engine'
import { JsonLd } from '@/components/seo/JsonLd'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_URL } from '@/lib/constants'

export function generateStaticParams() {
  return GAMES.map(g => ({ slug: g.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const game = getGameById(slug)
  if (!game) return {}

  const recGpuScore = game.requirements.recommended.gpuScore
  const matchingGpu = GPUs.find(g => Math.abs(g.benchmarkScore - recGpuScore) <= 10)

  return {
    title: `${game.name} PC Requirements & FPS Guide ${new Date().getFullYear()}`,
    description: `${game.name} system requirements, FPS benchmarks, and best CPU/GPU picks. Check if your PC can run ${game.name} at 1080p, 1440p, and 4K.`,
    keywords: [
      `${game.name.toLowerCase()} pc requirements`,
      `${game.name.toLowerCase()} fps`,
      `best gpu for ${game.name.toLowerCase()}`,
      `can i run ${game.name.toLowerCase()}`,
      `${game.name.toLowerCase()} system requirements`,
    ],
    alternates: { canonical: `${SITE_URL}/games/${slug}` },
    openGraph: {
      title: `${game.name} — PC Requirements & FPS Calculator`,
      description: `Recommended GPU score: ${game.requirements.recommended.gpuScore}/100. ${matchingGpu ? `e.g. ${matchingGpu.name}.` : ''}`,
    },
  }
}

const colorMap: Record<string, string> = {
  '--clr-ok':      '#00d4ff',
  '--clr-low':     '#22d3a0',
  '--clr-medium':  '#f5a524',
  '--clr-high':    '#ef4444',
  '--clr-critical':'#ff2056',
}

function fpsColor(fps: number): string {
  if (fps >= 144) return '#00d4ff'
  if (fps >= 60)  return '#22d3a0'
  if (fps >= 30)  return '#f5a524'
  return '#ef4444'
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const game = getGameById(slug)
  if (!game) notFound()

  // Best 5 GPU picks for this game at 1440p
  const refCpu = CPUs.find(c => c.benchmarkScore >= 70) ?? CPUs[0]
  const gpuPicks = [...GPUs]
    .map(gpu => ({
      gpu,
      est1080: estimateFps(refCpu, gpu, game, '1080p'),
      est1440: estimateFps(refCpu, gpu, game, '1440p'),
      est4k:   estimateFps(refCpu, gpu, game, '4k'),
    }))
    .sort((a, b) => b.est1440.fps - a.est1440.fps)

  // Best 5 CPU picks (using a reference mid-high GPU)
  const refGpu = GPUs.find(g => g.benchmarkScore >= 68) ?? GPUs[0]
  const cpuPicks = [...CPUs]
    .map(cpu => ({
      cpu,
      est1440: estimateFps(cpu, refGpu, game, '1440p'),
    }))
    .sort((a, b) => b.est1440.fps - a.est1440.fps)
    .slice(0, 5)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the PC requirements for ${game.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${game.name} minimum requirements: GPU score ${game.requirements.minimum.gpuScore}/100, CPU score ${game.requirements.minimum.cpuScore}/100, ${game.requirements.minimum.ramGb}GB RAM. Recommended: GPU score ${game.requirements.recommended.gpuScore}/100, CPU score ${game.requirements.recommended.cpuScore}/100, ${game.requirements.recommended.ramGb}GB RAM.`,
        },
      },
      {
        '@type': 'Question',
        name: `What GPU do I need for ${game.name} at 60 FPS?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For 60 FPS at 1080p in ${game.name}, you need a GPU with a benchmark score of approximately ${Math.round(game.requirements.recommended.gpuScore * 0.85)}/100 or higher. For 1440p, aim for ${game.requirements.recommended.gpuScore}/100 or better.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I run ${game.name} on a mid-range PC?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A mid-range PC (GPU score 55-70, CPU score 60-75, 16GB RAM) can run ${game.name} at ${game.requirements.recommended.gpuScore <= 65 ? 'medium to high' : 'low to medium'} settings at 1080p. For 1440p or higher settings, a more powerful GPU is recommended.`,
        },
      },
    ],
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-[--clr-text-muted] mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/games" className="hover:text-[--clr-accent] transition-colors">Games</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary]">{game.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[--clr-accent-dim] text-[--clr-accent] font-medium">
              {game.genre}
            </span>
            {game.isCompetitive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(245,165,36,0.15)] text-[--clr-medium] font-medium">
                Esports / Competitive
              </span>
            )}
            {game.hasRayTracing && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(34,211,160,0.15)] text-[--clr-low] font-medium">
                Ray Tracing
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {game.name} <span className="text-[--clr-accent]">PC Requirements</span> & FPS Guide
          </h1>
          <p className="text-[--clr-text-secondary] text-lg max-w-2xl">
            Full system requirements, FPS estimates for every GPU, and the best hardware picks for {game.name} in {new Date().getFullYear()}.
          </p>
        </div>

        {/* Requirements grid */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">System Requirements</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {([
              { label: 'Minimum',     req: game.requirements.minimum,     color: '--clr-high' },
              { label: 'Recommended', req: game.requirements.recommended, color: '--clr-low' },
              { label: 'Ultra / 4K',  req: game.requirements.ultra,       color: '--clr-accent' },
            ] as const).map(({ label, req, color }) => (
              <div key={label} className="card p-5" style={{ borderTopColor: `var(${color})`, borderTopWidth: 2 }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `var(${color})` }}>
                  {label}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[--clr-text-muted]">CPU Score</span>
                    <span className="font-mono font-bold">{req.cpuScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[--clr-text-muted]">GPU Score</span>
                    <span className="font-mono font-bold">{req.gpuScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[--clr-text-muted]">RAM</span>
                    <span className="font-mono font-bold">{req.ramGb}GB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FPS by GPU at 1440p */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-1">
            Best GPUs for {game.name}
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            Estimated FPS at each resolution · Reference CPU ({refCpu.name}) · 16GB RAM · High settings
          </p>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--clr-border] bg-[--clr-bg]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">GPU</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">1080p FPS</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">1440p FPS</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">4K FPS</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {gpuPicks.map(({ gpu, est1080, est1440, est4k }) => (
                    <tr
                      key={gpu.id}
                      className="border-b border-[--clr-border] hover:bg-[--clr-bg-elevated] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/gpu/${gpu.id}`} className="font-medium hover:text-[--clr-accent] transition-colors">
                          {gpu.name}
                        </Link>
                        <p className="text-xs text-[--clr-text-muted]">{gpu.vram}GB VRAM</p>
                      </td>
                      {[est1080, est1440, est4k].map((est, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          <span className="text-sm font-mono font-bold" style={{ color: fpsColor(est.fps) }}>
                            {est.fps}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <Link href={`/fps/${game.id}/${refCpu.id}/${gpu.id}`}>
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: `${fpsColor(est1440.fps)}20`,
                              color: fpsColor(est1440.fps),
                            }}
                          >
                            {est1440.setting} @ 1440p
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Best CPU picks */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-1">
            Best CPUs for {game.name}
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-5">
            Using {refGpu.name} as reference GPU · 1440p High settings
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {cpuPicks.map(({ cpu, est1440 }, i) => (
              <Link
                key={cpu.id}
                href={`/cpu/${cpu.id}`}
                className="card p-4 flex items-center gap-4 hover:border-[--clr-border-glow] transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-[--clr-bg-elevated] border border-[--clr-border] flex items-center justify-center text-xs font-bold text-[--clr-text-muted] flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-[--clr-accent] transition-colors truncate">{cpu.name}</p>
                  <p className="text-xs text-[--clr-text-muted]">{cpu.cores} cores · {cpu.boostClock}GHz</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono font-bold text-sm" style={{ color: fpsColor(est1440.fps) }}>
                    ~{est1440.fps} FPS
                  </p>
                  <p className="text-[10px] text-[--clr-text-muted]">1440p</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* GPU importance callout */}
        <section className="card-elevated p-6 mb-10">
          <h2 className="text-lg font-semibold mb-2">
            Is {game.name} GPU or CPU Dependent?
          </h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-[--clr-text-muted] mb-1">GPU Impact</p>
              <div className="h-2 bg-[--clr-bg] rounded-full">
                <div className="h-full rounded-full bg-[--clr-ok]" style={{ width: `${game.gpuBound * 100}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-[--clr-text-muted] mb-1">CPU Impact</p>
              <div className="h-2 bg-[--clr-bg] rounded-full">
                <div className="h-full rounded-full bg-[--clr-high]" style={{ width: `${(1 - game.gpuBound) * 100}%` }} />
              </div>
            </div>
          </div>
          <p className="text-sm text-[--clr-text-secondary]">
            {game.gpuBound >= 0.80
              ? `${game.name} is heavily GPU-bound. Upgrading your graphics card will have the biggest impact on FPS. A faster CPU provides diminishing returns beyond a mid-range processor.`
              : game.gpuBound >= 0.65
              ? `${game.name} has a balanced GPU/CPU workload. Both components matter — a slow CPU will bottleneck even a flagship GPU, especially at lower resolutions.`
              : `${game.name} is relatively CPU-bound. A fast processor with high single-core performance is especially important here. Even a mid-range GPU can produce high FPS with a strong CPU.`
            }
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: `Can I run ${game.name} on a budget PC?`,
                a: `The minimum GPU score for ${game.name} is ${game.requirements.minimum.gpuScore}/100 with ${game.requirements.minimum.ramGb}GB RAM. Budget builds can run the game at low-medium settings. For a smoother experience, aim for the recommended specs.`,
              },
              {
                q: `How many FPS will I get in ${game.name} at 1080p?`,
                a: `FPS at 1080p depends heavily on your GPU. With a mid-range GPU (score ~70/100), expect ${game.baseFps['1080p']} FPS at high settings. A flagship GPU (score 90+) can push ${Math.round(game.baseFps['1080p'] * 1.3)} FPS or more.`,
              },
              {
                q: `Does ${game.name} need a powerful CPU?`,
                a: `${game.name} weights GPU performance at ${Math.round(game.gpuBound * 100)}% and CPU at ${Math.round((1 - game.gpuBound) * 100)}%. ${game.gpuBound >= 0.80 ? 'The GPU is dominant — a mid-range CPU is sufficient.' : 'Both CPU and GPU matter equally — don\'t neglect your processor.'}`,
              },
            ].map(({ q, a }) => (
              <div key={q} className="card p-5">
                <h3 className="font-semibold text-sm mb-2">{q}</h3>
                <p className="text-sm text-[--clr-text-secondary]">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="card p-6 text-center">
          <p className="text-sm text-[--clr-text-secondary] mb-4">
            Check your exact CPU + GPU combo for {game.name}:
          </p>
          <Link
            href={`/?use=gaming-1440p`}
            className="inline-block px-6 py-3 rounded-[--radius-md] bg-[--clr-accent] text-[--clr-bg] font-semibold"
          >
            Open Bottleneck Calculator →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
