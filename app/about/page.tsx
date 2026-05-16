import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | PC Bottleneck Calculator',
  description: 'Learn more about the mission, data engine, and technology behind the PC Bottleneck Calculator — the most accurate free tool for PC builders.',
}

function CpuIllustration() {
  return (
    <div className="relative w-72 h-72 mx-auto mb-12 mt-8 group">
      {/* Ambient glow rings */}
      <div className="absolute inset-0 rounded-3xl bg-[--clr-accent] opacity-10 blur-3xl group-hover:opacity-25 transition-opacity duration-700" />
      <div className="absolute inset-4 rounded-2xl bg-[--clr-accent] opacity-5 blur-2xl group-hover:opacity-15 transition-opacity duration-700" />

      {/* PCB substrate */}
      <div className="absolute inset-2 bg-[#0a1f14] border-2 border-[#144028] rounded-xl shadow-2xl overflow-hidden">
        {/* PCB trace grid */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #1b6343 0, #1b6343 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, #1b6343 0, #1b6343 1px, transparent 1px, transparent 16px)' }}
        />
        {/* Diagonal traces */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #22c474 0, #22c474 1px, transparent 1px, transparent 24px)' }}
        />

        {/* Capacitor dots */}
        {[
          'top-3 left-6', 'top-3 right-6', 'bottom-3 left-6', 'bottom-3 right-6',
          'top-10 left-3', 'bottom-10 left-3', 'top-10 right-3', 'bottom-10 right-3',
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-2 h-3 rounded-sm bg-[#1a4a30] border border-[#22633d] shadow-inner`} />
        ))}

        {/* Heat spreader */}
        <div className="absolute inset-8 bg-gradient-to-br from-[#dde2e8] via-[#b0bac6] to-[#8a9aaa] rounded-lg
          shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),0_6px_20px_rgba(0,0,0,0.6)]
          flex flex-col items-center justify-center gap-2 p-4">

          {/* Brushed metal lines */}
          <div className="absolute inset-0 rounded-lg overflow-hidden opacity-30"
            style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 4px)' }}
          />

          <p className="relative text-[#2a3340] font-black text-xl tracking-tighter leading-none">BOTTLENECK</p>
          <p className="relative text-[#2a3340] font-mono text-[11px] font-bold opacity-70">CALC · X9 · 9950X3D</p>

          {/* Data matrix */}
          <div className="relative flex items-center gap-3 opacity-50 mt-1">
            <div className="w-8 h-8 grid grid-cols-4 grid-rows-4 gap-px bg-[#2a3340] p-px rounded-sm">
              {[1,0,1,1, 0,1,0,1, 1,1,0,0, 0,1,1,1].map((v, i) => (
                <div key={i} className={v ? 'bg-[#b0bac6]' : 'bg-[#2a3340]'} />
              ))}
            </div>
            <div className="text-[7px] text-[#2a3340] font-mono leading-tight">
              MADE IN<br/>CYBERSPACE<br/>© 2026
            </div>
          </div>

          {/* Triangle pin indicator (LGA-style) */}
          <div className="absolute bottom-2 left-2 w-0 h-0
            border-l-[7px] border-l-transparent
            border-b-[7px] border-b-[#c8a000]
            border-r-[7px] border-r-transparent
            -rotate-45" />
        </div>

        {/* Contact pins — top row */}
        <div className="absolute top-0.5 left-4 right-4 flex justify-between">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-0.5 h-1.5 bg-[#d4af37] rounded-b-sm opacity-80" />
          ))}
        </div>
        {/* bottom */}
        <div className="absolute bottom-0.5 left-4 right-4 flex justify-between">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-0.5 h-1.5 bg-[#d4af37] rounded-t-sm opacity-80" />
          ))}
        </div>
        {/* left */}
        <div className="absolute left-0.5 top-4 bottom-4 flex flex-col justify-between">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="h-0.5 w-1.5 bg-[#d4af37] rounded-r-sm opacity-80" />
          ))}
        </div>
        {/* right */}
        <div className="absolute right-0.5 top-4 bottom-4 flex flex-col justify-between">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="h-0.5 w-1.5 bg-[#d4af37] rounded-l-sm opacity-80" />
          ))}
        </div>
      </div>
    </div>
  )
}

const stats = [
  { value: '2.8M+', label: 'Benchmarks Analyzed' },
  { value: '500+', label: 'CPUs Indexed' },
  { value: '300+', label: 'GPUs Indexed' },
  { value: '40+', label: 'Games Profiled' },
]

const timeline = [
  { year: '2022', title: 'The Problem', desc: 'Frustrated with generic "10% bottleneck" calculators that gave the same answer for every build, we started building something better.' },
  { year: '2023', title: 'The Data Pipeline', desc: 'We processed 2.8 million UserBenchmark reports, normalizing scores across generations to build a use-case-aware performance model.' },
  { year: '2024', title: 'The Calculator', desc: 'Launched the first version with dynamic resolution weighting — 1080p vs 1440p vs 4K all produce different results, as they should.' },
  { year: '2025', title: 'Game Profiles', desc: 'Added per-game FPS estimation using engine-specific GPU/CPU workload weightings for 40+ titles including Cyberpunk 2077 and CS2.' },
  { year: '2026', title: 'Programmatic SEO', desc: 'Expanded to 170,000+ auto-generated comparison pages, making every CPU × GPU pairing instantly searchable.' },
]

const techStack = [
  { name: 'Next.js 14', desc: 'App Router with static generation for 170k+ pages at zero runtime cost.' },
  { name: 'TypeScript', desc: 'Fully typed hardware data pipeline from CSV → JSON → UI components.' },
  { name: 'Fuse.js', desc: 'Client-side fuzzy search across 800+ components with typo tolerance.' },
  { name: 'Recharts', desc: 'Interactive performance charts rendered at the edge.' },
  { name: 'Tailwind CSS v4', desc: 'Design system with CSS custom properties for real-time theme changes.' },
  { name: 'UserBenchmark Data', desc: '2.8 million normalized benchmark reports form the backbone of our scoring.' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[--clr-border-glow] bg-[--clr-bg-card] text-xs text-[--clr-text-secondary] mb-6">
            <span className="w-2 h-2 rounded-full bg-[--clr-accent] animate-pulse" />
            <span>Built by PC builders, for PC builders</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-[--clr-text-secondary] max-w-2xl mx-auto leading-relaxed">
            We are building the most accurate, data-driven PC bottleneck calculator on the internet — 
            completely free, no account required.
          </p>
        </div>

        {/* CPU Illustration */}
        <CpuIllustration />

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map(({ value, label }) => (
            <div key={label} className="card p-5 text-center">
              <p className="text-2xl font-mono font-bold" style={{ color: '#00d4ff' }}>{value}</p>
              <p className="text-xs text-[--clr-text-muted] mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">

          {/* Mission */}
          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              Building a PC or upgrading existing hardware can be intimidating. The age-old question — 
              <em>"Will this CPU bottleneck my GPU?"</em> — has plagued builders for decades. Most online answers 
              are either vague, outdated, or based on simplistic tier lists that ignore resolution, game engine, 
              RAM, and workload type.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              Our mission is simple: give every PC builder — from a teenager buying their first GPU to a 
              professional content creator upgrading a workstation — a precise, honest, and completely free 
              answer to that question.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed">
              We don't sell hardware. We don't have a brand bias. Every recommendation we make is driven 
              entirely by the benchmark data.
            </p>
          </section>

          {/* How We Calculate */}
          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">How We Calculate</h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-5">
              Most bottleneck calculators compare raw specs — core counts or VRAM — and output a generic number. 
              Ours is different. Our multi-factor engine accounts for:
            </p>
            <div className="space-y-3">
              {[
                { title: 'Resolution Weighting', desc: 'At 4K, the GPU handles ~80% of the workload. At 1080p, the CPU does ~45%. We dynamically adjust the bottleneck formula for your target resolution.' },
                { title: 'IPC & Generational Gains', desc: 'A 12th-gen Intel Core at 4.5GHz is not equal to a 6th-gen Core at the same clock. We model real single-thread and multi-thread IPC differences.' },
                { title: 'RAM Impact', desc: 'Running 8GB in 2026 causes measurable stuttering penalties independent of your CPU or GPU. Our calculator applies a configurable RAM performance modifier.' },
                { title: 'Thermal & Overclocking', desc: 'Enable thermal throttling in Advanced Options to simulate degraded sustained performance, or add overclock offsets to see real uplift potential.' },
                { title: 'Use-Case Profiles', desc: 'Gaming 1080p, 1440p, 4K, game streaming, and video editing all have different CPU-to-GPU balance ratios baked into separate calculation modes.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3 p-3 rounded-[--radius-sm] bg-[--clr-bg-elevated]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[--clr-accent] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{title}</p>
                    <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The Data Engine */}
          <section className="card p-6 md:p-8 border-l-4 border-[--clr-accent]">
            <h2 className="text-2xl font-bold mb-4">The Data Engine</h2>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              Our benchmark database starts with <strong className="text-[--clr-text-primary]">2.8 million UserBenchmark reports</strong>, 
              processed through a custom CSV-to-JSON normalization pipeline. Every CPU and GPU gets a 
              normalized score on a 0–100 scale relative to the current top-of-market.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
              These scores are not a simple average. We weight recency (more recent tests count more), 
              filter outliers from overclocked or misconfigured systems, and cross-reference against 
              independent benchmarks from Digital Foundry, GamersNexus, and TechPowerUp to catch anomalies.
            </p>
            <p className="text-[--clr-text-secondary] leading-relaxed">
              The result: any CPU vs any GPU pairing from the last 15 years produces a meaningful, 
              comparable bottleneck score — not just a made-up percentage.
            </p>
          </section>

          {/* Timeline */}
          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Our Journey</h2>
            <div className="relative pl-6 border-l-2 border-[--clr-border] space-y-6">
              {timeline.map(({ year, title, desc }) => (
                <div key={year} className="relative">
                  <div className="absolute -left-[1.45rem] w-3 h-3 rounded-full bg-[--clr-accent] border-2 border-[--clr-bg-card]" />
                  <p className="text-xs font-mono text-[--clr-accent] mb-0.5">{year}</p>
                  <p className="font-semibold mb-1">{title}</p>
                  <p className="text-sm text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Built With</h2>
            <p className="text-[--clr-text-secondary] text-sm mb-5 leading-relaxed">
              The calculator is fully open-architecture — no black-box AI, no paid APIs, no server costs 
              per query. Everything runs at the edge on statically generated pages.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {techStack.map(({ name, desc }) => (
                <div key={name} className="p-3 rounded-[--radius-sm] bg-[--clr-bg-elevated] border border-[--clr-border]">
                  <p className="font-mono text-xs font-bold text-[--clr-accent] mb-1">{name}</p>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { emoji: '🔓', title: 'Always Free', desc: 'The core calculator will never be paywalled. No signup, no trial, no limits.' },
                { emoji: '📊', title: 'Data First', desc: 'Every result comes from real benchmark data, not guesswork or sponsored rankings.' },
                { emoji: '🔒', title: 'Privacy Respecting', desc: 'We don\'t track your builds server-side. Your data stays in your browser.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="text-center p-4 rounded-[--radius-sm] bg-[--clr-bg-elevated]">
                  <div className="text-3xl mb-2">{emoji}</div>
                  <p className="font-semibold text-sm mb-1">{title}</p>
                  <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="card p-6 text-center bg-[--clr-bg-elevated]">
            <p className="text-[--clr-text-secondary] mb-4 text-sm">Ready to check your build?</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[--radius-md] font-semibold hover:opacity-90 transition-opacity"
              style={{ background: '#00d4ff', color: '#0a0b10' }}
            >
              Open the Calculator →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
