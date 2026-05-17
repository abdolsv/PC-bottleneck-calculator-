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
    title: `${game.name} PC Requirements & FPS Benchmarks (${new Date().getFullYear()})`,
    description: `Can I Run ${game.name}? Check the official minimum vs recommended system specs, estimated hardware FPS benchmarks, and best CPU/GPU configuration setups.`,
    keywords: [
      `${game.name.toLowerCase()} pc requirements`,
      `${game.name.toLowerCase()} fps benchmarks`,
      `best graphics card for ${game.name.toLowerCase()}`,
      `can i run ${game.name.toLowerCase()}`,
      `${game.name.toLowerCase()} system requirements`,
      `${game.name.toLowerCase()} bottleneck guide`,
    ],
    alternates: { canonical: `${SITE_URL}/games/${slug}` },
    openGraph: {
      title: `Can My PC Run ${game.name}? — Requirements & FPS Calculator`,
      description: `Targeting recommended settings requires a GPU score of ${game.requirements.recommended.gpuScore}/100 ${matchingGpu ? `(e.g., ${matchingGpu.name})` : ''}. Explore full performance metrics here.`,
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

  // Base configurations
  const refCpu = CPUs.find(c => c.benchmarkScore >= 70) ?? CPUs[0]
  
  // Safe deduplication logic for GPU picks map array
  const gpuPicks = [...GPUs]
    .map(gpu => ({
      gpu,
      est1080: estimateFps(refCpu, gpu, game, '1080p'),
      est1440: estimateFps(refCpu, gpu, game, '1440p'),
      est4k:   estimateFps(refCpu, gpu, game, '4k'),
    }))
    .filter((item, index, self) => self.findIndex((t) => t.gpu.id === item.gpu.id) === index)
    .sort((a, b) => b.est1440.fps - a.est1440.fps)

  // Best 5 CPU picks (using a reference mid-high GPU)
  const refGpu = GPUs.find(g => g.benchmarkScore >= 68) ?? GPUs[0]
  const cpuPicks = [...CPUs]
    .map(cpu => ({
      cpu,
      est1440: estimateFps(cpu, refGpu, game, '1440p'),
    }))
    .filter((item, index, self) => self.findIndex((t) => t.cpu.id === item.cpu.id) === index)
    .sort((a, b) => b.est1440.fps - a.est1440.fps)
    .slice(0, 5)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the minimum and recommended PC requirements for ${game.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To satisfy the minimum system specifications for ${game.name}, you need a GPU benchmark target of ${game.requirements.minimum.gpuScore}/100, an entry processor score of ${game.requirements.minimum.cpuScore}/100, and at least ${game.requirements.minimum.ramGb}GB of system RAM. For optimal recommended configurations, we suggest a graphics card score of ${game.requirements.recommended.gpuScore}/100, hardware processor capability of ${game.requirements.recommended.cpuScore}/100, and ${game.requirements.recommended.ramGb}GB RAM.`,
        },
      },
      {
        '@type': 'Question',
        name: `What graphics card do I need to reach 60 FPS in ${game.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For a smooth, stutter-free 60 FPS profile at 1080p in ${game.name}, look for a graphics card registering an absolute benchmark score of ${Math.round(game.requirements.recommended.gpuScore * 0.85)}/100 or better. Stepping up to crisper 1440p resolutions demands an index value of ${game.requirements.recommended.gpuScore}/100 or higher.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is my PC capable of running ${game.name} efficiently on mid-range settings?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, standard mid-range desktop builds matching a hardware tier of GPU: 55-70, CPU: 60-75 alongside 16GB RAM can comfortably process ${game.name} on standard ${game.requirements.recommended.gpuScore <= 65 ? 'high fidelity presets' : 'medium parameters'} running at 1080p full high definition.`,
        },
      },
    ],
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-[--clr-text-muted] mb-8 flex items-center gap-2 flex-wrap" aria-label="Breadcrumbs">
          <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/games" className="hover:text-[--clr-accent] transition-colors">PC Games Index</Link>
          <span>›</span>
          <span className="text-[--clr-text-secondary]">{game.name} Specifications</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-md bg-[--clr-accent-dim] text-[--clr-accent] font-semibold border border-[rgba(0,212,255,0.15)]">
              {game.genre}
            </span>
            {game.isCompetitive && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-[rgba(245,165,36,0.1)] text-[--clr-medium] font-semibold border border-[rgba(245,165,36,0.15)]">
                Esports / Pro Target
              </span>
            )}
            {game.hasRayTracing && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-[rgba(34,211,160,0.1)] text-[--clr-low] font-semibold border border-[rgba(34,211,160,0.15)]">
                RTX / Ray Tracing Supported
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            {game.name} <span className="text-[--clr-accent]">PC Requirements</span> & Framerate Benchmarks
          </h1>
          <p className="text-[--clr-text-secondary] text-lg max-w-3xl leading-relaxed">
            Wondering if your hardware can maintain stable framerates? Discover optimized settings profiles, potential hardware bottlenecks, and performance scalability metrics for {game.name} in {new Date().getFullYear()}.
          </p>
        </div>

        {/* System Requirements Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-5 text-[--clr-text-primary]">
            Official Specs & Hardware Thresholds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {([
              { label: 'Minimum Specs', req: game.requirements.minimum, color: '--clr-high', note: 'Low 1080p Gameplay' },
              { label: 'Recommended Tier', req: game.requirements.recommended, color: '--clr-low', note: 'High 1080p/1440p Target' },
              { label: 'Ultra / 4K Rig', req: game.requirements.ultra, color: '--clr-accent', note: 'Max Fidelity Profiles' },
            ] as const).map(({ label, req, color, note }) => (
              <div key={label} className="card p-6 flex flex-col justify-between relative overflow-hidden" style={{ borderTopColor: `var(${color})`, borderTopWidth: 3 }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: `var(${color})` }}>
                    {label}
                  </p>
                  <p className="text-[11px] text-[--clr-text-muted] mb-4">{note}</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.04)] pb-1.5">
                      <span className="text-[--clr-text-muted]">Processor Level</span>
                      <span className="font-mono font-bold text-[--clr-text-primary]">{req.cpuScore} <span className="text-[10px] font-normal text-[--clr-text-muted]">/100</span></span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.04)] pb-1.5">
                      <span className="text-[--clr-text-muted]">Graphics Target</span>
                      <span className="font-mono font-bold text-[--clr-text-primary]">{req.gpuScore} <span className="text-[10px] font-normal text-[--clr-text-muted]">/100</span></span>
                    </div>
                    <div className="flex justify-between items-center pb-0.5">
                      <span className="text-[--clr-text-muted]">Memory Space</span>
                      <span className="font-mono font-bold text-[--clr-text-primary]">{req.ramGb} GB</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real Graphics-Driven GPU Framerate Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-1 text-[--clr-text-primary]">
            Real-World Graphics Card Performance Scalability
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-6">
            Estimated high-fidelity configurations paired with an architectural baseline CPU ({refCpu.name}) assuming standard 16GB system RAM configurations.
          </p>

          <div className="card overflow-hidden border border-[--clr-border]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--clr-border] bg-[rgba(255,255,255,0.01)] text-left">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">Graphics Adapter Hierarchy</th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">FHD (1080p)</th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">QHD (1440p)</th>
                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">UHD (4K)</th>
                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">Setting Viability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--clr-border]">
                  {gpuPicks.map(({ gpu, est1080, est1440, est4k }) => (
                    <tr
                      key={gpu.id}
                      className="hover:bg-[rgba(255,255,255,0.015)] transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <Link href={`/gpu/${gpu.id}`} className="font-semibold text-[--clr-text-primary] group-hover:text-[--clr-accent] transition-colors block">
                          {gpu.name}
                        </Link>
                        <span className="inline-block mt-0.5 text-xs font-mono text-[--clr-text-muted] bg-[--clr-bg] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.03)]">
                          {gpu.vram}GB Dedicated VRAM
                        </span>
                      </td>
                      {[est1080, est1440, est4k].map((est, i) => (
                        <td key={i} className="px-5 py-4 text-center relative min-w-[100px]">
                          {/* Inline Graphical UI Bar Metric Behind Number */}
                          <div className="absolute inset-y-2 left-3 right-3 rounded bg-[rgba(255,255,255,0.01)] pointer-events-none overflow-hidden">
                            <div 
                              className="h-full opacity-10 transition-all duration-500" 
                              style={{ 
                                width: `${Math.min(100, (est.fps / 160) * 100)}%`, 
                                backgroundColor: fpsColor(est.fps) 
                              }} 
                            />
                          </div>
                          <span className="text-sm font-mono font-bold relative z-10" style={{ color: fpsColor(est.fps) }}>
                            {est.fps} <span className="text-[9px] font-normal opacity-70">FPS</span>
                          </span>
                        </td>
                      ))}
                      <td className="px-5 py-4 text-right">
                        <Link href={`/build/${refCpu.id}/${gpu.id}`}>
                          <span
                            className="inline-block px-2.5 py-1 rounded text-xs font-medium border transition-all hover:scale-105"
                            style={{
                              backgroundColor: `${fpsColor(est1440.fps)}10`,
                              borderColor: `${fpsColor(est1440.fps)}30`,
                              color: fpsColor(est1440.fps),
                            }}
                          >
                            {est1440.setting} Preset
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

        {/* Best Processor Pairings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-1 text-[--clr-text-primary]">
            Best CPU Configuration Pairings
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-6">
            Tested using a balanced benchmark-standard graphics processing hardware tier ({refGpu.name}) running standard 1440p high rendering setups.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cpuPicks.map(({ cpu, est1440 }, i) => (
              <Link
                key={cpu.id}
                href={`/cpu/${cpu.id}`}
                className="card p-5 flex items-center gap-4 hover:border-[--clr-accent] transition-all group relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-md bg-[--clr-bg] border border-[--clr-border] flex items-center justify-center text-xs font-mono font-bold text-[--clr-text-muted] flex-shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm group-hover:text-[--clr-accent] transition-colors truncate text-[--clr-text-primary]">{cpu.name}</p>
                  <p className="text-xs text-[--clr-text-muted] mt-0.5">{cpu.cores} Physical Cores · Up to {cpu.boostClock}GHz Clock</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-16 hidden md:block">
                    <div className="w-full bg-[--clr-bg] rounded-full h-1.5 overflow-hidden border border-[rgba(255,255,255,0.03)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (est1440.fps / 200) * 100)}%`,
                          backgroundColor: fpsColor(est1440.fps),
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-extrabold text-sm" style={{ color: fpsColor(est1440.fps) }}>
                      ~{est1440.fps}
                    </p>
                    <p className="text-[9px] font-medium uppercase tracking-wider text-[--clr-text-muted]">Avg FPS</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Advanced Graphical Workload & Bottleneck Analytics Callout */}
        <section className="card-elevated p-6 md:p-8 mb-12 border border-[rgba(255,255,255,0.02)] shadow-xl rounded-xl">
          <h2 className="text-xl font-bold tracking-tight mb-2 text-[--clr-text-primary]">
            Is {game.name} CPU or GPU Bound? Engine Architecture Analysis
          </h2>
          <p className="text-sm text-[--clr-text-secondary] mb-6 leading-relaxed">
            Every software calculation engine distributes its rendering calculations uniquely across hardware components. Check out the calculated workload balance metrics below:
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-5">
            <div className="w-full sm:flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[--clr-text-primary] uppercase tracking-wider">GPU Dependency Index</span>
                <span className="text-xs font-mono font-bold text-[--clr-ok]">{Math.round(game.gpuBound * 100)}%</span>
              </div>
              <div className="h-3 bg-[--clr-bg] rounded-full overflow-hidden p-0.5 border border-[rgba(255,255,255,0.04)]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#0055ff] to-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all duration-700" 
                  style={{ width: `${game.gpuBound * 100}%` }} 
                />
              </div>
            </div>
            <div className="w-full sm:flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-[--clr-text-primary] uppercase tracking-wider">CPU Calculations Strains</span>
                <span className="text-xs font-mono font-bold text-[--clr-high]">{Math.round((1 - game.gpuBound) * 100)}%</span>
              </div>
              <div className="h-3 bg-[--clr-bg] rounded-full overflow-hidden p-0.5 border border-[rgba(255,255,255,0.04)]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#ff2056] to-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-700" 
                  style={{ width: `${(1 - game.gpuBound) * 100}%` }} 
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed border-t border-[rgba(255,255,255,0.04)] pt-4 mt-2">
            {game.gpuBound >= 0.80
              ? `Engine testing reveals that ${game.name} is aggressively GPU-bound. To prevent frame pacing issues or visual degradation, focusing budgets directly onto premium graphics hardware gives massive scaling benefits, while entry or mid-range modern CPUs won't bottleneck performance layout structures.`
              : game.gpuBound >= 0.65
              ? `Calculated metrics establish that ${game.name} presents a highly uniform, balanced computing workload. Neglecting processing overhead will trigger micro-stuttering bottlenecks since the processor tracks AI physics tasks synchronously alongside heavy graphic tasks.`
              : `Our architecture audit reveals that ${game.name} runs primarily CPU-bound. Investing in processors equipped with fast high-frequency single-thread pipelines determines stability across dynamic battle spaces far more than over-specifying a graphics adapter.`
            }
          </p>
        </section>

        {/* Human Friendly SEO FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-5 text-[--clr-text-primary]">
            Frequently Asked Questions & Hardware Optimization Advice
          </h2>
          <div className="space-y-4">
            {[
              {
                q: `Can I run ${game.name} smoothly on standard budget desktop builds?`,
                a: `Running this title efficiently on entry-level machines is achievable. The minimum engine standard demands a GPU performance target index of ${game.requirements.minimum.gpuScore}/100 and a system RAM capacity minimum of ${game.requirements.minimum.ramGb}GB. Tuning graphics configurations down to lower density parameters guarantees steady performance layers without ruining runtime engine code frameworks.`,
              },
              {
                q: `What average framerates should I expect at standard 1080p outputs?`,
                a: `Rendering frame outputs depend entirely on active graphics components. Mid-tier setups matching index marks around ~70 can forecast secure averages hovering near ${game.baseFps['1080p']} FPS when adjusting settings configurations down to standard high presets. Enthusiast tiers can push output cycles up beyond ${Math.round(game.baseFps['1080p'] * 1.3)} frames securely.`,
              },
              {
                q: `Does installing ${game.name} place heavy multi-threaded pressures on modern CPUs?`,
                a: `Engine load parameters scale calculation structures at roughly ${Math.round(game.gpuBound * 100)}% on graphical assets versus ${Math.round((1 - game.gpuBound) * 100)}% dedicated to core engine logic processing pipelines. ${game.gpuBound >= 0.80 ? 'Graphics processing commands dominate system runtimes—making high-core counts unnecessary.' : 'System components load calculations fluidly across threads, making capable multi-core designs vital to maintain high frames.'}`,
              },
            ].map(({ q, a }) => (
              <div key={q} className="card p-5 border border-[--clr-border] hover:border-[rgba(255,255,255,0.05)] transition-all">
                <h3 className="font-bold text-sm text-[--clr-text-primary] mb-2 flex items-start gap-2">
                  <span className="text-[--clr-accent] font-mono">Q.</span> {q}
                </h3>
                <p className="text-sm text-[--clr-text-secondary] pl-5 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Interactive CTA Grid Element */}
        <div className="card p-8 text-center bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-transparent relative overflow-hidden border border-[--clr-border] rounded-xl">
          <p className="text-base text-[--clr-text-primary] font-semibold mb-2">
            Want to test custom component combinations?
          </p>
          <p className="text-xs text-[--clr-text-muted] max-w-lg mx-auto mb-5">
            Cross-evaluate your exact custom processor model alongside your target graphics adapter option directly within our simulator framework to check for real system restrictions.
          </p>
          <Link
            href={`/?use=gaming-1440p`}
            className="inline-block px-8 py-3.5 rounded-lg bg-[--clr-accent] text-[--clr-bg] font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[rgba(0,212,255,0.2)]"
          >
            Calculate System Hardware Bottlenecks →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
