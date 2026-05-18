// components/storage/StorageSearchList.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface StorageItem {
  id: string
  name: string
  brand: string
  model: string
  score: number
  samples: number
  type: string
  capacity: string
  price: number
  rank: number
}

export default function StorageSearchList({ initialItems }: { initialItems: StorageItem[] }) {
  const [query, setQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'samples' | 'name'>('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Extract metadata dynamically from data stream
  const structuralBrands = useMemo(() => {
    const list = new Set<string>()
    initialItems.forEach(item => { if (item.brand) list.add(item.brand) })
    return ['All', ...Array.from(list).sort()]
  }, [initialItems])

  const structuralTypes = useMemo(() => {
    const list = new Set<string>()
    initialItems.forEach(item => { if (item.type) list.add(item.type) })
    return ['All', ...Array.from(list).sort()]
  }, [initialItems])

  // Process pipeline: filter -> sort -> paginate
  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.brand.toLowerCase().includes(query.toLowerCase()) ||
        (item.model && item.model.toLowerCase().includes(query.toLowerCase()))

      const matchesBrand = selectedBrand === 'All' || item.brand === selectedBrand
      const matchesType = selectedType === 'All' || item.type === selectedType

      return matchesSearch && matchesBrand && matchesType
    })
  }, [initialItems, query, selectedBrand, selectedType])

  const sortedItems = useMemo(() => {
    const activeList = [...filteredItems]
    return activeList.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
      else if (sortBy === 'score') comparison = a.score - b.score
      else if (sortBy === 'samples') comparison = a.samples - b.samples
      else comparison = a.rank - b.rank

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredItems, sortBy, sortOrder])

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedItems.slice(start, start + itemsPerPage)
  }, [sortedItems, currentPage])

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)

  const toggleSort = (field: 'rank' | 'score' | 'samples' | 'name') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const scoreColor = (score: number) =>
    score >= 80 ? '#00d4ff' : score >= 60 ? '#22d3a0' : score >= 40 ? '#f5a524' : '#ef4444'

  return (
    <div className="space-y-10">
      {/* Hero Banner Grid */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--clr-bg-elevated] via-transparent to-transparent border border-[--clr-border] p-6 md:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[--clr-accent]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl">
          <nav className="text-xs text-[--clr-text-muted] mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[--clr-accent] transition-colors">Home</Link>
            <span>›</span>
            <span className="text-[--clr-text-secondary]">Storage Hardware Rankings</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            SSD Benchmark Performance Rankings
          </h1>
          <p className="text-sm md:text-base text-[--clr-text-secondary] leading-relaxed mb-6">
            Real-world non-volatile storage performance telemetry mapped via{' '}
            <strong className="text-[--clr-accent]">{initialItems.reduce((a, b) => a + b.samples, 0).toLocaleString()}</strong> active performance tracks. Compare performance metrics across NVMe PCIe Gen5, Gen4, and legacy Solid State Drives.
          </p>

          {/* Main Controls Console */}
          <div className="grid gap-3 sm:grid-cols-3 bg-[--clr-bg-card]/50 p-3 rounded-xl border border-[--clr-border]">
            <div className="sm:col-span-3 relative">
              <input
                type="text"
                placeholder="Search storage hardware..."
                value={query}
                onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[--clr-bg] text-sm text-[--clr-text-primary] placeholder-[--clr-text-muted] border border-[--clr-border] focus:border-[--clr-accent] rounded-lg px-4 py-3 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[--clr-text-muted] uppercase font-bold mb-1 tracking-wider">Manufacturer</label>
              <select
                value={selectedBrand}
                onChange={e => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs bg-[--clr-bg] text-[--clr-text-primary] border border-[--clr-border] rounded-md p-2 outline-none focus:border-[--clr-accent]"
              >
                {structuralBrands.map(brand => <option key={`brand-opt-${brand}`} value={brand}>{brand}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[--clr-text-muted] uppercase font-bold mb-1 tracking-wider">Form/Protocol</label>
              <select
                value={selectedType}
                onChange={e => { setSelectedType(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs bg-[--clr-bg] text-[--clr-text-primary] border border-[--clr-border] rounded-md p-2 outline-none focus:border-[--clr-accent]"
              >
                {structuralTypes.map(type => <option key={`type-opt-${type}`} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[--clr-text-muted] uppercase font-bold mb-1 tracking-wider">Sorting Focus</label>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleSort(sortBy)}
                  className="w-full text-xs bg-[--clr-bg] hover:bg-[--clr-bg-elevated] text-[--clr-text-secondary] border border-[--clr-border] rounded-md p-2 text-center transition-all font-medium"
                >
                  Order: {sortOrder.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Performance Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Monitored Silicon', value: initialItems.length.toLocaleString(), metricColor: '#00d4ff' },
          { label: 'Evaluation Datasets', value: `${Math.round(initialItems.reduce((a, b) => a + b.samples, 0) / 1000)}K+`, metricColor: '#22d3a0' },
          { label: 'Peak Matrix Score', value: `${initialItems.length > 0 ? Math.max(...initialItems.map(i => i.score)) : 0}/100`, metricColor: '#f5a524' },
          { label: 'Filtered Yield', value: `${sortedItems.length} Drives`, metricColor: '#a855f7' },
        ].map(({ label, value, metricColor }) => (
          <div key={`stat-card-${label}`} className="bg-[--clr-bg-elevated]/40 border border-[--clr-border] rounded-xl p-4 text-center backdrop-blur-sm">
            <p className="text-xl md:text-2xl font-mono font-bold" style={{ color: metricColor }}>{value}</p>
            <p className="text-[11px] uppercase tracking-wider text-[--clr-text-muted] mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Informational Storage Tier Panels */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: '⚡', title: 'Gen5 NVMe Protocol', desc: 'Saturates sequential bandwidth limits up to 14 GB/s. Required for high-throughput raw content generation models and complex workflow caching.' },
          { icon: '💾', title: 'Gen4 NVMe Architecture', desc: 'Delivers stable processing targets at 5–7 GB/s. Represents the optimized processing tier for performance scaling in standard configurations.' },
          { icon: '📀', title: 'Legacy SATA Interface', desc: 'Caps bandwidth execution at ~550 MB/s. Acts as high-capacity secondary node execution paths for background archival array frameworks.' },
        ].map(({ icon, title, desc }) => (
          <div key={`info-panel-${title}`} className="bg-[--clr-bg-card] border border-[--clr-border] rounded-xl p-5 hover:border-[--clr-accent]/20 transition-all duration-300">
            <div className="text-3xl mb-3">{icon}</div>
            <p className="font-bold text-sm mb-1.5 text-[--clr-text-primary]">{title}</p>
            <p className="text-xs text-[--clr-text-secondary] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Main Relational Visual Matrix */}
      {sortedItems.length === 0 ? (
        <div className="bg-[--clr-bg-card] border border-[--clr-border] rounded-xl p-16 text-center text-[--clr-text-muted] font-medium">
          Zero storage profiles match the current filter permutation parameters.
        </div>
      ) : (
        <div className="bg-[--clr-bg-card] border border-[--clr-border] rounded-xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-[--clr-border] bg-[--clr-bg-elevated]/20 flex items-center justify-between">
            <h2 className="font-bold text-sm tracking-wide text-[--clr-text-primary]">System Hardware Telemetry Stream</h2>
            <span className="text-xs bg-[--clr-accent]/10 text-[--clr-accent] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[--clr-border] bg-[--clr-bg-elevated]/60 text-[11px] uppercase tracking-wider text-[--clr-text-muted] select-none">
                  <th onClick={() => toggleSort('rank')} className="px-6 py-4 font-semibold cursor-pointer hover:text-[--clr-text-primary] transition-colors w-20">Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th onClick={() => toggleSort('name')} className="px-6 py-4 font-semibold cursor-pointer hover:text-[--clr-text-primary] transition-colors">Component Descriptor {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className="px-6 py-4 font-semibold hidden md:table-cell">Bus Type</th>
                  <th onClick={() => toggleSort('score')} className="px-6 py-4 font-semibold text-center cursor-pointer hover:text-[--clr-text-primary] transition-colors w-28">Matrix Score {sortBy === 'score' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th onClick={() => toggleSort('samples')} className="px-6 py-4 font-semibold text-center cursor-pointer hover:text-[--clr-text-primary] transition-colors hidden sm:table-cell w-32">Telemetry Nodes {sortBy === 'samples' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--clr-border] bg-[--clr-bg]/10">
                {paginatedItems.map((item) => (
                  <tr
                    key={`node-row-${item.id}-${item.rank}`}
                    className="hover:bg-[--clr-bg-elevated]/30 transition-colors group duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-[--clr-text-muted] font-semibold">
                      {item.rank >= 1 && item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : `#${item.rank}`}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/storage/${item.id}`}
                        className="font-semibold text-[--clr-text-primary] group-hover:text-[--clr-accent] transition-colors block text-sm"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[--clr-text-muted] font-medium">{item.brand}</span>
                        {item.capacity && (
                          <>
                            <span className="text-[10px] text-[--clr-border]">•</span>
                            <span className="text-[11px] font-mono font-bold bg-[--clr-bg-elevated] px-1.5 py-0.2 rounded text-[--clr-text-secondary]">{item.capacity}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-[--clr-text-secondary] hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded bg-[--clr-bg-elevated] border border-[--clr-border]">
                        {item.type || 'M.2 NVMe'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block font-mono font-black text-sm px-2.5 py-0.5 rounded border"
                           style={{ color: scoreColor(item.score), backgroundColor: `${scoreColor(item.score)}0A`, borderColor: `${scoreColor(item.score)}25` }}>
                        {Math.round(item.score)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-mono text-[--clr-text-muted] hidden sm:table-cell">
                      {item.samples.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interface Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[--clr-border] bg-[--clr-bg-elevated]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[--clr-text-muted] font-medium">
                Showing entries <span className="text-[--clr-text-primary] font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-[--clr-text-primary] font-bold">{Math.min(currentPage * itemsPerPage, sortedItems.length)}</span> of <span className="text-[--clr-text-primary] font-bold">{sortedItems.length}</span> verified engines.
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded bg-[--clr-bg] border border-[--clr-border] text-xs font-semibold disabled:opacity-40 hover:bg-[--clr-bg-elevated] transition-all disabled:pointer-events-none"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  if (pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1) {
                    return (
                      <button
                        key={`pagination-index-trigger-${pageNumber}`}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 rounded text-xs font-mono font-bold transition-all border ${
                          currentPage === pageNumber
                            ? 'bg-[--clr-accent] text-[--clr-bg] border-[--clr-accent]'
                            : 'bg-[--clr-bg] border-[--clr-border] text-[--clr-text-secondary] hover:bg-[--clr-bg-elevated]'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === 2 || pageNumber === totalPages - 1) {
                    return <span key={`pagination-break-${pageNumber}`} className="text-xs text-[--clr-text-muted] font-bold px-1 select-none">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded bg-[--clr-bg] border border-[--clr-border] text-xs font-semibold disabled:opacity-40 hover:bg-[--clr-bg-elevated] transition-all disabled:pointer-events-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Extended Architectural Technical Analyses */}
      <div className="border-t border-[--clr-border] pt-10 grid md:grid-cols-2 gap-8 text-sm text-[--clr-text-secondary] leading-relaxed">
        <div className="bg-[--clr-bg-card]/30 p-5 rounded-xl border border-[--clr-border]">
          <h3 className="text-base font-bold text-[--clr-text-primary] mb-3 flex items-center gap-2">
            <span>📊</span> Storage Array Real-Time Overhead Dynamics
          </h3>
          <p className="mb-3 text-xs">
            While high performance storage arrays do not directly raise maximum rendering calculations during operational execution bounds, they dictate the latency coefficients during massive data streaming tasks.
          </p>
          <p className="text-xs">
            Modern high throughput engine runtimes require massive asset ingestion patterns. Having a low-tier drive means asset pipeline processing queues cause severe stutter frames during resource load spikes.
          </p>
        </div>

        <div className="bg-[--clr-bg-card]/30 p-5 rounded-xl border border-[--clr-border]">
          <h3 className="text-base font-bold text-[--clr-text-primary] mb-3 flex items-center gap-2">
            <span>⚙️</span> DirectStorage Execution Topology
          </h3>
          <p className="mb-3 text-xs">
            DirectStorage completely re-routes standard file access layouts. Instead of querying storage items, loading block sets to system memory space, decoding inside core execution threads, and writing results out to specialized VRAM boundaries, it sets up explicit direct communication paths.
          </p>
          <p className="text-xs">
            Encrypted compression pipelines pass data packages instantly directly to graphics processing subsystems via modern high-speed NVMe protocols. This makes upgrading legacy SATA structures to NVMe standard a critical choice.
          </p>
        </div>
      </div>
    </div>
  )
}
