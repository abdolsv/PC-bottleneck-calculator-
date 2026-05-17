// app/games/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { GAMES } from '@/lib/games-data'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'PC Game FPS Database — Hardware Bottleneck Specs Tracker',
  description: `Analyze real-world high-resolution FPS estimates and structural engine requirements across a directory of ${GAMES.length}+ titles. Prevent hardware bottlenecking easily.`,
  alternates: { canonical: `${SITE_URL}/games` },
}

const popularGames = [
  'cyberpunk-2077', 'valorant', 'counter-strike-2', 'elden-ring',
  'fortnite', 'baldurs-gate-3', 'starfield', 'helldivers-2',
]

export default function GamesPage() {
  const featured = GAMES.filter(g => popularGames.includes(g.id))
  const allSorted = [...GAMES].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Hero Section with Embedded Geometric Render */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 border-b border-[--clr-border] pb-10">
          <div className="lg:col-span-7">
            <nav className="text-xs text-[--clr-text-muted] mb-4 flex items-center gap-1.5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
              <span>›</span>
              <span className="text-[--clr-text-secondary]">Game Engine Performance Index</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-[--clr-text-primary]">
              PC Game <span className="text-[--clr-accent]">FPS Database</span>
            </h1>
            <p className="text-[--clr-text-secondary] text-base md:text-lg leading-relaxed max-w-xl">
              Cross-reference graphics engine architectures across a catalog of modern titles. Discover localized framerate ceilings, driver overhead parameters, and optimized processing configurations before upgrading.
            </p>
          </div>
          
          {/* Abstract Geometric 3D Game Mesh Wireframe Graphic Component */}
          <div className="hidden lg:block lg:col-span-5 relative h-48 w-full overflow-hidden bg-[--clr-bg-elevated] rounded-xl border border-[rgba(255,255,255,0.02)] shadow-inner group">
            <div className="absolute inset-0 bg-radial-gradient from-[rgba(0,212,255,0.08)] to-transparent pointer-events-none" />
            <svg viewBox="0 0 400 200" className="w-full h-full stroke-[rgba(0,212,255,0.2)] group-hover:stroke-[rgba(0,212,255,0.45)] fill-none transition-colors duration-500">
              {/* Isometric 3D Polygon Plane Mesh Terrain Grid Rendering */}
              <path d="M 50,130 L 120,80 L 200,120 L 130,170 Z" className="fill-[rgba(0,212,255,0.01)]" />
              <path d="M 120,80 L 190,40 L 270,70 L 200,120 Z" className="fill-[rgba(0,212,255,0.02)]" />
              <path d="M 200,120 L 270,70 L 350,110 L 280,160 Z" className="fill-[rgba(0,212,255,0.01)]" />
              {/* Dynamic Coordinate Spikes & Vertices nodes */}
              <line x1="120" y1="80" x2="120" y2="45" stroke="#22d3a0" strokeWidth="1.5" strokeDasharray="2,2" />
              <circle cx="120" cy="45" r="3" fill="#22d3a0" />
              <line x1="200" y1="120" x2="200" y2="60" stroke="#00d4ff" strokeWidth="1.5" />
              <circle cx="200" cy="60" r="3.5" fill="#00d4ff" className="animate-pulse" />
              <line x1="270" y1="70" x2="270" y2="30" stroke="#f5a524" strokeWidth="1.5" strokeDasharray="2,2" />
              <circle cx="270" cy="30" r="3" fill="#f5a524" />
              {/* Secondary Topological Connective Lines */}
              <polyline points="120,45 200,60 270,30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </svg>
            <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-[--clr-text-muted] bg-[--clr-bg] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.04)]">
              Simulation Graph Layer v1.2
            </div>
          </div>
        </div>

        {/* Featured / Popular Systems Layout Grid */}
        <section className="mb-14">
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="text-xl font-bold tracking-tight text-[--clr-text-primary]">Trending & Heavy-Load Titles</h2>
            <span className="text-xs font-mono text-[--clr-text-muted]">Real-Time Hardware Profiles</span>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map(game => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="card p-5 hover:border-[--clr-accent] bg-[--clr-bg-elevated] flex flex-col justify-between transition-all group duration-300 transform hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[--clr-accent-dim] text-[--clr-accent] font-bold tracking-wide uppercase">
                      {game.genre.split(' / ')[0]}
                    </span>
                    {game.isCompetitive && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(245,165,36,0.08)] text-[--clr-medium] font-bold tracking-wide uppercase border border-[rgba(245,165,36,0.1)]">
                        High Refresh
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-base text-[--clr-text-primary] group-hover:text-[--clr-accent] transition-colors leading-snug mb-1">
                    {game.name}
                  </p>
                  <p className="text-xs text-[--clr-text-muted]">{game.releaseYear} · Engine Studio: {game.publisher}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)] flex justify-between items-center">
                  <span className="text-[11px] text-[--clr-text-muted]">Recommended Target:</span>
                  <span className="font-mono text-xs font-bold text-[--clr-accent] bg-[--clr-bg] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.03)]">
                    {game.requirements.recommended.gpuScore} <span className="opacity-40 text-[9px]">/100</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Global Directory A–Z Section */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <h2 className="text-xl font-bold tracking-tight text-[--clr-text-primary]">
              Complete Engine Configuration Index ({GAMES.length} Titles)
            </h2>
            <p className="text-xs font-mono text-[--clr-text-muted]">Sorted Alphabetically (A-Z)</p>
          </div>

          {/* High-Refresh Rate Competitive Meta Optimization Box */}
          <div className="card p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-5 bg-gradient-to-r from-[rgba(0,212,255,0.02)] to-transparent border border-[rgba(0,212,255,0.1)]">
            <div className="flex-1">
              <p className="text-sm font-bold text-[--clr-text-primary] mb-0.5">Targeting High Refresh Rate Monitors (144Hz - 360Hz)?</p>
              <p className="text-xs text-[--clr-text-secondary] leading-relaxed">
                Fast-paced multiplayer calculations depend heavily on memory execution bounds and raw processor instruction pipelining. Make sure your CPU isn't capping your GPU rasterization limits.
              </p>
            </div>
            <Link href="/" className="sm:flex-shrink-0 px-4 py-2.5 rounded-md bg-[--clr-accent] text-[--clr-bg] text-xs font-extrabold text-center hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[rgba(0,212,255,0.15)]">
              Analyze Component Bottlenecks →
            </Link>
          </div>

          {/* Secure Responsive Execution Grid Table */}
          <div className="card overflow-hidden border border-[--clr-border]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--clr-border] bg-[rgba(255,255,255,0.015)] text-left">
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">Game Title Descriptor</th>
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[--clr-text-muted] hidden sm:table-cell">Primary Engine Classification</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">Minimum Index</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-[--clr-text-muted]">Recommended Scaling</th>
                    <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-[--clr-text-muted] hidden md:table-cell">Launch Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--clr-border]">
                  {allSorted.map(game => (
                    <tr
                      key={game.id}
                      className="hover:bg-[rgba(255,255,255,0.01)] transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <Link href={`/games/${game.id}`} className="font-bold text-[--clr-text-primary] group-hover:text-[--clr-accent] transition-colors block">
                          {game.name}
                        </Link>
                        {/* Fallback layout pill info visible on mobile viewport sizes only */}
                        <span className="inline-block sm:hidden mt-1 text-[10px] font-mono opacity-80 text-[--clr-text-muted]">
                          {game.genre.split(' / ')[0]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[--clr-text-secondary] font-medium text-xs hidden sm:table-cell">
                        {game.genre.split(' / ')[0]}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-mono font-medium text-[--clr-text-muted] bg-[--clr-bg] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.02)]">
                          {game.requirements.minimum.gpuScore}/100
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-mono font-bold text-[--clr-accent] bg-[--clr-accent-dim] px-2 py-0.5 rounded border border-[rgba(0,212,255,0.05)]">
                          {game.requirements.recommended.gpuScore}/100
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center text-xs font-mono text-[--clr-text-muted] hidden md:table-cell">
                        {game.releaseYear}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Informative Informational Search Prose Content Layout */}
        <section className="border-t border-[--clr-border] pt-8 bg-gradient-to-b from-[rgba(255,255,255,0.005)] to-transparent p-6 rounded-xl">
          <h2 className="text-xl font-bold tracking-tight text-[--clr-text-primary] mb-3">
            Understanding Game Engine Hardware Optimization Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[--clr-text-secondary] text-sm leading-relaxed">
            <p>
              Different game rendering environments interact uniquely with system hardware components. Geometry-heavy open-world landscapes utilize ray tracing algorithms and high-resolution textures, loading memory channels and texture mapping units heavily. Consequently, these configurations become primarily bound by graphics processors at high display parameters.
            </p>
            <p>
              Conversely, multiplayer competitive shooters use highly optimized rasterization methods to achieve fast rendering cycles. This switches processing strain away from the GPU over to the system processor to handle network synchronization and geometry updates. Balancing your configuration avoids systematic framework slowdowns, ensuring smooth tracking across all gaming resolutions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
