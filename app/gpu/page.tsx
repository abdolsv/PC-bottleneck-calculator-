// app/gpu/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { GPUs } from '@/lib/hardware-data'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'GPU Bottleneck Calculator — All Graphics Cards',
  description: 'Find the best CPU pairing for any GPU. Bottleneck analysis for every NVIDIA and AMD graphics card — RTX 4090, RTX 4070, RX 7900 XTX, and more.',
  alternates: { canonical: `${SITE_URL}/gpu` },
}

// Group by brand
const nvidiaGpus = GPUs.filter(g => g.brand === 'NVIDIA').sort((a, b) => b.benchmarkScore - a.benchmarkScore)
const amdGpus    = GPUs.filter(g => g.brand === 'AMD').sort((a, b) => b.benchmarkScore - a.benchmarkScore)

const tierLabel: Record<number, string> = { 5: 'Flagship', 4: 'High-End', 3: 'Mid-Range', 2: 'Entry', 1: 'Budget' }
const tierColor: Record<number, string> = {
  5: 'text-[--clr-critical]', 4: 'text-[--clr-high]',
  3: 'text-[--clr-medium]', 2: 'text-[--clr-low]', 1: 'text-[--clr-ok]'
}

export default function GpuIndexPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10">
          <nav className="text-xs text-[--clr-text-muted] mb-4">
            <Link href="/" className="hover:text-[--clr-accent]">Home</Link>
            <span className="mx-2">›</span>
            <span>GPU Bottleneck Calculator</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2">GPU Bottleneck Calculator</h1>
          <p className="text-[--clr-text-secondary]">
            Select your graphics card to find the best CPU pairing, see compatibility ratings,
            and eliminate bottlenecks for your target resolution.
          </p>
        </div>

        {/* NVIDIA Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[--clr-ok]" />
            <h2 className="text-lg font-semibold">NVIDIA GeForce</h2>
            <span className="text-xs text-[--clr-text-muted]">{nvidiaGpus.length} GPUs</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {nvidiaGpus.map(gpu => (
              <Link
                key={gpu.id}
                href={`/gpu/${gpu.id}`}
                className="card p-4 hover:border-[--clr-border-glow] transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm group-hover:text-[--clr-accent] transition-colors truncate">
                      {gpu.name}
                    </p>
                    <p className="text-xs text-[--clr-text-muted] mt-0.5">
                      {gpu.vram}GB VRAM · {gpu.targetResolution} · {gpu.tdp}W
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-semibold ${tierColor[gpu.tier]}`}>{tierLabel[gpu.tier]}</p>
                    <p className="text-xs text-[--clr-text-muted] font-mono">{gpu.benchmarkScore}/100</p>
                  </div>
                </div>
                {/* Score bar */}
                <div className="mt-3 w-full bg-[--clr-bg-elevated] rounded-full h-1">
                  <div
                    className="h-full rounded-full bg-[--clr-ok] opacity-60"
                    style={{ width: `${gpu.benchmarkScore}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AMD Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[--clr-high]" />
            <h2 className="text-lg font-semibold">AMD Radeon</h2>
            <span className="text-xs text-[--clr-text-muted]">{amdGpus.length} GPUs</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {amdGpus.map(gpu => (
              <Link
                key={gpu.id}
                href={`/gpu/${gpu.id}`}
                className="card p-4 hover:border-[--clr-border-glow] transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm group-hover:text-[--clr-accent] transition-colors truncate">
                      {gpu.name}
                    </p>
                    <p className="text-xs text-[--clr-text-muted] mt-0.5">
                      {gpu.vram}GB VRAM · {gpu.targetResolution} · {gpu.tdp}W
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-semibold ${tierColor[gpu.tier]}`}>{tierLabel[gpu.tier]}</p>
                    <p className="text-xs text-[--clr-text-muted] font-mono">{gpu.benchmarkScore}/100</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-[--clr-bg-elevated] rounded-full h-1">
                  <div
                    className="h-full rounded-full bg-[--clr-high] opacity-60"
                    style={{ width: `${gpu.benchmarkScore}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO text */}
        <div className="border-t border-[--clr-border] pt-8">
          <h2 className="text-xl font-semibold mb-3">What Is a GPU Bottleneck?</h2>
          <p className="text-[--clr-text-secondary] text-sm leading-relaxed mb-4">
            A GPU bottleneck occurs when your graphics card is so much more powerful than your CPU that the
            CPU cannot supply frames fast enough to keep the GPU fully loaded. The GPU sits idle, waiting for
            the CPU to finish its calculations. This is common at 1080p with high-end GPUs.
          </p>
          <p className="text-[--clr-text-secondary] text-sm leading-relaxed">
            At 4K resolution, the GPU does far more work per frame, making CPU bottlenecks much less common.
            Selecting the right CPU for your GPU — based on your target resolution — is the key to avoiding waste.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
