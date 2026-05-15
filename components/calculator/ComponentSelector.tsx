// components/calculator/ComponentSelector.tsx
'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import type { CPU, GPU } from '@/lib/hardware-data'

type Item = CPU | GPU

interface ComponentSelectorProps<T extends Item> {
  label: string
  items: T[]
  selected: T | null
  onSelect: (item: T) => void
  renderLabel: (item: T) => string
  renderMeta?: (item: T) => string
  placeholder?: string
}

export function ComponentSelector<T extends Item>({
  label, items, selected, onSelect, renderLabel, renderMeta, placeholder = 'Search...',
}: ComponentSelectorProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => items.filter(item => renderLabel(item).toLowerCase().includes(search.toLowerCase())),
    [items, search, renderLabel]
  )

  // Group by generation/brand
  const grouped = useMemo(() => {
    const groups: Record<string, T[]> = {}
    filtered.forEach(item => {
      const key = ('generation' in item ? item.generation : item.brand) as string
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return groups
  }, [filtered])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-[--clr-text-secondary] uppercase tracking-widest mb-2">
        {label}
      </label>

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-3
          bg-[--clr-bg-elevated] border rounded-[--radius-md] text-sm text-left
          transition-all duration-[--transition-fast]
          ${open ? 'border-[--clr-accent] shadow-[0_0_0_3px_rgba(0,212,255,0.1)]' : 'border-[--clr-border] hover:border-[--clr-border-glow]'}
        `}
      >
        <span className={selected ? 'text-[--clr-text-primary]' : 'text-[--clr-text-muted]'}>
          {selected ? renderLabel(selected) : placeholder}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {selected && (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(null as unknown as T) }}
              className="text-[--clr-text-muted] hover:text-[--clr-text-primary]"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`text-[--clr-text-muted] transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-[--clr-bg-elevated] border border-[--clr-border-glow] rounded-[--radius-md] shadow-xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[--clr-border]">
            <Search size={14} className="text-[--clr-text-muted] flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-[--clr-text-primary] placeholder:text-[--clr-text-muted] outline-none"
            />
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[--clr-text-muted] bg-[--clr-bg]">
                  {group}
                </div>
                {groupItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { onSelect(item); setOpen(false); setSearch('') }}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                      transition-colors duration-[--transition-fast]
                      ${selected?.id === item.id
                        ? 'bg-[--clr-accent-dim] text-[--clr-accent]'
                        : 'text-[--clr-text-primary] hover:bg-[--clr-bg-card]'
                      }
                    `}
                  >
                    <span>{renderLabel(item)}</span>
                    {renderMeta && (
                      <span className="text-xs text-[--clr-text-muted] font-mono">{renderMeta(item)}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-sm text-[--clr-text-muted] text-center">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
