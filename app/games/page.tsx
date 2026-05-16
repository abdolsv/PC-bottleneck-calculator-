// app/games/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { GAMES } from '@/lib/games-data'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'PC Game FPS Calculator — Can My PC Run These Games?',
  description: `Check FPS estimates and PC requirements for ${GAMES.length}+ games. Find the best CPU and GPU for any game. Free, instant results.`,
  alternates: { canonical: `${SITE_URL}/games` },
}

// Group games by genre for better UX & internal linking
const genres = Array.from(new Set(GAMES.map(g => g.genre.split(' / ')[0]))).sort()

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
      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <nav className="text-xs text-[--clr-text-muted] mb-4">
            <Link href="/" className="hover:text-[--clr-accent]">Home</Link>
            <span className="mx-2">›</span>
            <span>Game FPS Database</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2">Game FPS Calculator</h1>
          <p className="text-[--clr-text-secondary] max-w-2xl">
            Select any game to see exactly how many frames per second your CPU and GPU will
            produce — at 1080p, 1440p, and 4K. Includes system requirements and best hardware picks.
          </p>
        </div>

        {/* Featured / Popular */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Popular Games</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map(game => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="card p-4 hover:border-[--clr-border-glow] transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[--clr-accent-dim] text-[--clr-accent] font-medium truncate">
                    {game.genre.split(' / ')[0]}
                  </span>
                  {game.isCompetitive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(245,165,36,0.15)] text-[--clr-medium] font-medium">
                      Esports
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm group-hover:text-[--clr-accent] transition-colors leading-tight">
                  {game.name}
                </p>
                <p className="text-xs text-[--clr-text-muted] mt-1">{game.releaseYear} · {game.publisher}</p>
                <div className="mt-2 pt-2 border-t border-[--clr-border]">
                  <p className="text-xs text-[--clr-text-secondary]">
                    Recommended GPU score: <span className="font-mono text-[--clr-accent]">{game.requirements.recommended.gpuScore}/100</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Games A–Z */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">All Games ({GAMES.length})</h2>

          {/* Competitive / Esports callout */}
          <div className="card p-4 mb-6 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Playing competitively?</p>
              <p className="text-xs text-[--clr-text-secondary] mt-0.5">
                Esports titles like Valorant, CS2, and Apex Legends need high FPS, not just 60. Check how many frames your rig can push.
              </p>
            </div>
            <Link href="/" className="flex-shrink-0 px-4 py-2 rounded-[--radius-sm] bg-[--clr-accent] text-[--clr-bg] text-xs font-semibold whitespace-nowrap">
              Check My Build →
            </Link>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--clr-border] bg-[--clr-bg]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">Game</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted] hidden sm:table-cell">Genre</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">Min GPU</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted]">Rec GPU</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[--clr-text-muted] hidden md:table-cell">Year</th>
                </tr>
              </thead>
              <tbody>
                {allSorted.map(game => (
                  <tr
                    key={game.id}
                    className="border-b border-[--clr-border] hover:bg-[--clr-bg-elevated] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/games/${game.id}`} className="font-medium hover:text-[--clr-accent] transition-colors">
                        {game.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[--clr-text-muted] text-xs hidden sm:table-cell">
                      {game.genre.split(' / ')[0]}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-mono font-medium text-[--clr-text-secondary]">
                        {game.requirements.minimum.gpuScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-mono font-bold text-[--clr-accent]">
                        {game.requirements.recommended.gpuScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-[--clr-text-muted] hidden md:table-cell">
                      {game.releaseYear}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SEO content */}
        <section className="border-t border-[--clr-border] pt-8">
          <h2 className="text-xl font-semibold mb-3">How Do We Calculate FPS?</h2>
          <p className="text-[--clr-text-secondary] text-sm leading-relaxed mb-4">
            Our FPS estimates are based on benchmark data from thousands of tested builds,
            normalized against a reference system and scaled by your CPU and GPU performance scores.
            Every game has a different GPU/CPU balance — competitive shooters like Valorant are far
            less GPU-dependent than open-world titles like Cyberpunk 2077.
          </p>
          <p className="text-[--clr-text-secondary] text-sm leading-relaxed">
            Results are estimates and vary by driver version, in-game settings, background processes,
            and system temperatures. Use these as directional guidance when choosing hardware.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
