// components/gpu/GpuSearchList.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GPU } from '@/lib/hardware-data'

interface GpuSearchListProps {
  initialNvidia: GPU[]
  initialAmd: GPU[]
  initialIntel: GPU[]
}

const tierLabel: Record<number, string> = { 5: 'Flagship', 4: 'High-End', 3: 'Mid-Range', 2: 'Entry', 1: 'Budget' }
const tierColor: Record<number, string> = {
  5: 'text-[--clr-critical]', 4: 'text-[--clr-high]',
  3: 'text-[--clr-medium]', 2: 'text-[--clr-low]', 1: 'text-[--clr-ok]'
}

export default function GpuSearchList({ initialNvidia, initialAmd, initialIntel }: GpuSearchListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filterGpus = (gpus: GPU[]) => {
    return gpus.filter(gpu => 
      gpu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gpu.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredNvidia = filterGpus(initialNvidia)
  const filteredAmd = filterGpus(initialAmd)
  const filteredIntel = filterGpus(initialIntel)
  const totalCount = filteredNvidia.length + filteredAmd.length + filteredIntel.length

  return (
    <div className="space-y-12">
      {/* --- HERO HEADER WITH SEARCH BAR --- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] to-transparent border border-[--clr-border] p-6 md:p-10">
        <div className="relative z-10 max-w-2xl">
          <nav className="text-xs text-[--clr-text-muted] mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
            <span className="text-[--clr-border]">›</span>
            <span className="text-[--clr-text-secondary]">GPU Index</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            GPU Bottleneck Index & Hardware Profiles
          </h1>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-6">
            Explore our comprehensive database of graphics processors to analyze systemic frame distribution metrics and discover perfectly balanced host CPU configurations.
          </p>
          
          {/* Search Box Container */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search graphics cards (e.g., RTX 4070 Ti, RX 7900)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[--clr-bg] text-sm text-[--clr-text] placeholder-[--clr-text-muted] border border-[--clr-border] focus:border-[--clr-accent] rounded-xl px-4 py-3 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[--clr-text-muted] hover:text-[--clr-text] px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zero State Fallback */}
      {totalCount === 0 && (
        <div className="text-center py-12 card border-dashed border-[--clr-border] rounded-xl">
          <p className="text-sm text-[--clr-text-secondary]">No graphics card models matching &ldquo;{searchQuery}&rdquo; were located.</p>
        </div>
      )}

      {/* --- NVIDIA SECTION --- */}
      {filteredNvidia.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-[--clr-border] pb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900]">NVIDIA</span>
            <h2 className="text-base sm:text-lg font-bold text-[--clr-text]">GeForce Architecture</h2>
            <span className="text-xs text-[--clr-text-muted] font-mono ml-auto">{filteredNvidia.length} Units</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNvidia.map((gpu, idx) => (
              <Link
                key={`${gpu.id}-nvidia-${idx}`}
                href={`/gpu/${gpu.id}`}
                className="card p-4 hover:border-[--clr-border-glow] hover:bg-[--clr-bg-elevated] transition-all duration-200 group flex flex-col justify-between rounded-xl"
              >
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm group-hover:text-[--clr-accent] transition-colors truncate">
                      {gpu.name}
                    </p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${tierColor[gpu.tier]}`}>
                      {tierLabel[gpu.tier]}
                    </span>
                  </div>
                  <p className="text-xs text-[--clr-text-muted] truncate">
                    {gpu.vram}GB VRAM · {gpu.targetResolution} · {gpu.tdp > 0 ? `${gpu.tdp}W` : 'Variable TDP'}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[--clr-border]/40 flex items-center justify-between text-[11px]">
                  <span className="text-[--clr-text-muted]">Compute Rating</span>
                  <span className="font-mono font-bold text-[--clr-accent]">{gpu.benchmarkScore}/100</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- AMD SECTION --- */}
      {filteredAmd.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-[--clr-border] pb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#ED1C24]/10 text-[#ED1C24]">AMD</span>
            <h2 className="text-base sm:text-lg font-bold text-[--clr-text]">Radeon Compute Engines</h2>
            <span className="text-xs text-[--clr-text-muted] font-mono ml-auto">{filteredAmd.length} Units</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAmd.map((gpu, idx) => (
              <Link
                key={`${gpu.id}-amd-${idx}`}
                href={`/gpu/${gpu.id}`}
                className="card p-4 hover:border-[--clr-border-glow] hover:bg-[--clr-bg-elevated] transition-all duration-200 group flex flex-col justify-between rounded-xl"
              >
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm group-hover:text-[--clr-accent] transition-colors truncate">
                      {gpu.name}
                    </p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${tierColor[gpu.tier]}`}>
                      {tierLabel[gpu.tier]}
                    </span>
                  </div>
                  <p className="text-xs text-[--clr-text-muted] truncate">
                    {gpu.vram}GB VRAM · {gpu.targetResolution} · {gpu.tdp > 0 ? `${gpu.tdp}W` : 'Variable TDP'}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[--clr-border]/40 flex items-center justify-between text-[11px]">
                  <span className="text-[--clr-text-muted]">Compute Rating</span>
                  <span className="font-mono font-bold text-[--clr-accent]">{gpu.benchmarkScore}/100</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- INTEL SECTION --- */}
      {filteredIntel.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-[--clr-border] pb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#0071C5]/10 text-[#0071C5]">INTEL</span>
            <h2 className="text-base sm:text-lg font-bold text-[--clr-text]">Arc Graphics Technology</h2>
            <span className="text-xs text-[--clr-text-muted] font-mono ml-auto">{filteredIntel.length} Units</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntel.map((gpu, idx) => (
              <Link
                key={`${gpu.id}-intel-${idx}`}
                href={`/gpu/${gpu.id}`}
                className="card p-4 hover:border-[--clr-border-glow] hover:bg-[--clr-bg-elevated] transition-all duration-200 group flex flex-col justify-between rounded-xl"
              >
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm group-hover:text-[--clr-accent] transition-colors truncate">
                      {gpu.name}
                    </p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${tierColor[gpu.tier]}`}>
                      {tierLabel[gpu.tier]}
                    </span>
                  </div>
                  <p className="text-xs text-[--clr-text-muted] truncate">
                    {gpu.vram}GB VRAM · {gpu.targetResolution} · {gpu.tdp > 0 ? `${gpu.tdp}W` : 'Variable TDP'}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[--clr-border]/40 flex items-center justify-between text-[11px]">
                  <span className="text-[--clr-text-muted]">Compute Rating</span>
                  <span className="font-mono font-bold text-[--clr-accent]">{gpu.benchmarkScore}/100</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- DEEP DATA SEO CONTENT BLOCKS (400+ Words) --- */}
      <hr className="border-[--clr-border]" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm text-[--clr-text-secondary] leading-relaxed pt-2">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[--clr-text]">How GPU Selection Directs Bottleneck Vulnerability</h3>
          <p>
            When building or modifying a custom custom gaming computer configuration, selecting your graphics card dictates the frame delivery standard of your system. A graphics core creates spatial geometry and maps textures while relying entirely on data fed from your Central Processing Unit. If a target GPU is paired with an underpowered, legacy processor, the computing cores will constantly idle, waiting on operations. This operational delay is known as a <strong>CPU bottleneck</strong>.
          </p>
          <p>
            Conversely, setting up an ultra-premium CPU alongside an entry-level graphics layout leads to a <strong>GPU bottleneck</strong>. In this dynamic, your rendering system is running at absolute capacity, unable to process visual frames at the pace your host hardware expects. Our system analyzes historical profiling configurations to find the balance threshold to ensure clean data delivery pipelines.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-[--clr-text]">Resolution Scaling & Computational Workloads</h3>
          <p>
            Render parameters alter frame execution paths significantly. Setting display environments to standard <strong>1080p (Full HD)</strong> pushes operational priorities heavily back onto structural processing components. High-end computing platforms need to run at maximum frequencies to sustain extreme output limits.
          </p>
          <p>
            When advancing display engines up to <strong>1440p (Quad HD)</strong> or extreme <strong>4K Ultra HD resolution</strong> environments, calculations shift comprehensively into silicon logic grids, shader frameworks, and VRAM memory banks. Shifting the frame composition overhead onto structural GPU architectures levels the playing field for central processors. Understanding these distinct bottlenecks lets you purchase a configuration tailored for your display hardware, avoiding unnecessary premium system component premiums.
          </p>
        </div>
      </div>
    </div>
  )
}
