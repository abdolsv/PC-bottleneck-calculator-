// app/about/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Cpu, Zap, Shield, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About PC Bottleneck Calculator',
  description: 'Learn how our free PC bottleneck calculator works, our methodology, and why we built it.',
}

const features = [
  { icon: <Zap size={20} />, title: 'Instant Analysis', desc: 'Results in under a second. No server-side processing needed.' },
  { icon: <Shield size={20} />, title: 'No Data Collection', desc: 'We never store your selections. Everything runs locally in your browser.' },
  { icon: <BarChart3 size={20} />, title: 'Use-Case Weighted', desc: 'Unlike simple ratio calculators, we weight results by resolution and workload.' },
  { icon: <Cpu size={20} />, title: 'Continuously Updated', desc: 'Database expands with every new GPU and CPU generation.' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">About This Tool</h1>
        <p className="text-[--clr-text-secondary] leading-relaxed mb-10">
          PC Bottleneck Calculator was built because every other tool on the internet either used over-simplified
          percentage ratios, was covered in ads, or required signing up. We built the tool we wished existed.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="card p-5">
              <div className="w-9 h-9 rounded-[--radius-sm] bg-[--clr-accent-dim] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[--clr-accent] mb-3">
                {icon}
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-[--clr-text-secondary]">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-3">Our Methodology</h2>
        <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
          We normalize CPU and GPU benchmark scores on a 0–100 scale relative to the current generation.
          The bottleneck percentage is computed using use-case specific weights — at 4K gaming, the GPU
          matters 80% of the equation; at 1080p, it drops to 55%.
        </p>
        <p className="text-[--clr-text-secondary] leading-relaxed mb-4">
          We also account for RAM — running 8GB in a gaming rig with a modern GPU adds a penalty,
          because DDR5 bandwidth and dual-channel configurations matter for frame times.
        </p>
        <p className="text-sm text-[--clr-text-muted]">
          Disclaimer: Results are estimates based on benchmark data and weighted formulas.
          Real-world results vary by specific game, driver version, background processes, and thermal throttling.
          Use this as a directional guide.
        </p>
      </main>
      <Footer />
    </>
  )
}
