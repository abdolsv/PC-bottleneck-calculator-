// components/cpu/CpuSearchList.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CPU } from '@/lib/hardware-data'

interface CpuSearchListProps {
  initialIntel: CPU[]
  initialAmd: CPU[]
}

export default function CpuSearchList({ initialIntel, initialAmd }: CpuSearchListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filterCpus = (cpus: CPU[]) => {
    return cpus.filter(cpu =>
      cpu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cpu.generation.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredIntel = filterCpus(initialIntel)
  const filteredAmd = filterCpus(initialAmd)
  const totalCount = filteredIntel.length + filteredAmd.length

  // Extract unique sorted tracking labels safely
  const getUniqueGenerations = (cpus: CPU[]) => {
    return Array.from(new Set(cpus.map(c => c.generation)))
  }

  const intelGenerations = getUniqueGenerations(filteredIntel)
  const amdGenerations = getUniqueGenerations(filteredAmd)

  return (
    <div className="space-y-12">
      {/* --- HERO SECTION WITH CSS CHIP GRAPHIC --- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] to-transparent border border-[--clr-border] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative z-10 max-w-xl w-full">
          <nav className="text-xs text-[--clr-text-muted] mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
            <span className="text-[--clr-border]">›</span>
            <span className="text-[--clr-text-secondary]">CPU Calculator</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            CPU Bottleneck Calculator
          </h1>
          <p className="text-sm text-[--clr-text-secondary] leading-relaxed mb-6">
            Select your specific hardware architecture to calculate processing limits and locate performance-matched graphics configurations.
          </p>
          
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search processors (e.g., Celeron N4000, Ryzen 5)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[--clr-bg] text-sm text-[--clr-text] placeholder-[--clr-text-muted] border border-[--clr-border] focus:border-[--clr-accent] rounded-xl px-4 py-3 outline-none transition-all"
            />
          </div>
        </div>

        {/* Responsive Hardware Vector Enclosure Graphic */}
        <div className="w-full md:w-56 h-36 relative border border-[--clr-border] bg-[--clr-bg] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="w-24 h-24 border border-[--clr-text-muted]/20 rounded bg-[--clr-bg-elevated]/60 flex items-center justify-center p-1.5 relative">
            <div className="absolute inset-x-2 top-0 h-0.5 border-t border-dashed border-[--clr-accent]/40" />
            <div className="absolute inset-x-2 bottom-0 h-0.5 border-b border-dashed border-[--clr-accent]/40" />
            <div className="w-full h-full border border-[--clr-border] rounded-sm bg-[--clr-bg] flex flex-col p-1.5 justify-between">
              <span className="font-mono text-[6px] text-[--clr-text-muted]">DIE_MATRIX</span>
              <div className="grid grid-cols-2 gap-1 w-10 mx-auto">
                <div className="h-2 rounded bg-[--clr-accent]/30 border border-[--clr-accent]/40 animate-pulse" />
                <div className="h-2 rounded bg-[--clr-text-muted]/10 border border-[--clr-border]" />
              </div>
              <span className="font-mono text-[5px] text-[--clr-accent] text-right font-bold">x86 Engine</span>
            </div>
          </div>
        </div>
      </div>

      {totalCount === 0 && (
        <div className="text-center py-12 card border-dashed border-[--clr-border] rounded-xl">
          <p className="text-sm text-[--clr-text-secondary]">No desktop or mobile hardware matches found.</p>
        </div>
      )}

      {/* --- INTEL LAYOUT ARCHITECTURES --- */}
      {filteredIntel.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-[--clr-border] pb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#0071C5]/10 text-[#0071C5]">INTEL</span>
            <h2 className="text-base sm:text-lg font-bold text-[--clr-text]">Silicon Processors</h2>
          </div>
          <div className="space-y-8">
            {intelGenerations.map((gen) => (
              <div key={`intel-group-${gen}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[--clr-text-muted] mb-3 ml-1">{gen}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredIntel.filter(c => c.generation === gen).map((cpu) => (
                    <Link
                      key={cpu.id}
                      href={`/cpu/${cpu.id}`}
                      className="card p-4 hover:border-[--clr-border-glow] hover:bg-[--clr-bg-elevated] transition-all group flex flex-col justify-between rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm group-hover:text-[--clr-accent] transition-colors truncate">{cpu.name}</p>
                          <p className="text-xs text-[--clr-text-muted] mt-1">Score Engine Rating</p>
                        </div>
                        <span className="font-mono text-sm font-bold text-[--clr-accent]">{cpu.benchmarkScore}</span>
                      </div>
                      <div className="mt-4 w-full bg-[--clr-bg-elevated] rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-[--clr-accent] opacity-60" style={{ width: `${cpu.benchmarkScore}%` }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- AMD LAYOUT ARCHITECTURES --- */}
      {filteredAmd.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-[--clr-border] pb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#ED1C24]/10 text-[#ED1C24]">AMD</span>
            <h2 className="text-base sm:text-lg font-bold text-[--clr-text]">Compute Nodes</h2>
          </div>
          <div className="space-y-8">
            {amdGenerations.map((gen) => (
              <div key={`amd-group-${gen}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[--clr-text-muted] mb-3 ml-1">{gen}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredAmd.filter(c => c.generation === gen).map((cpu) => (
                    <Link
                      key={cpu.id}
                      href={`/cpu/${cpu.id}`}
                      className="card p-4 hover:border-[--clr-border-glow] hover:bg-[--clr-bg-elevated] transition-all group flex flex-col justify-between rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm group-hover:text-[--clr-high] transition-colors truncate">{cpu.name}</p>
                          <p className="text-xs text-[--clr-text-muted] mt-1">Score Engine Rating</p>
                        </div>
                        <span className="font-mono text-sm font-bold text-[--clr-high]">{cpu.benchmarkScore}</span>
                      </div>
                      <div className="mt-4 w-full bg-[--clr-bg-elevated] rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-[--clr-high] opacity-60" style={{ width: `${cpu.benchmarkScore}%` }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
