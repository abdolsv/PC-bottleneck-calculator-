// components/calculator/ComponentSelector.tsx
'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown, X, Plus, Trash2 } from 'lucide-react'
import Fuse from 'fuse.js'
import type { CPU, GPU } from '@/lib/hardware-data'

type Item = CPU | GPU

interface ComponentSelectorProps<T extends Item> {
  label: string
  items: T[]
  customItems?: T[]
  selected: T | null
  onSelect: (item: T | null) => void
  renderLabel: (item: T) => string
  renderMeta?: (item: T) => string
  placeholder?: string
  onAddCustom?: () => void
  onDeleteCustom?: (id: string) => void
}

export function ComponentSelector<T extends Item>({
  label, items, customItems = [], selected, onSelect,
  renderLabel, renderMeta, placeholder = 'Search...',
  onAddCustom, onDeleteCustom,
}: ComponentSelectorProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems = useMemo(() => [...customItems, ...items], [customItems, items])

  const fuse = useMemo(() => new Fuse(allItems, {
    keys: ['name', 'brand', 'model'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [allItems])

  const filtered = useMemo(() => {
    if (!search) return items.slice(0, 200) // limit initial render to 200 items to avoid lag
    return fuse.search(search).map(res => res.item).filter(item => items.includes(item as T)).slice(0, 100)
  }, [fuse, search, items])

  const customFiltered = useMemo(() => {
    if (!search) return customItems
    return fuse.search(search).map(res => res.item).filter(item => customItems.includes(item as T))
  }, [fuse, search, customItems])

  // Group standard items by generation/brand
  const grouped = useMemo(() => {
    const groups: Record<string, T[]> = {}
    filtered.forEach(item => {
      const key = ('generation' in item ? item.generation : item.brand) as string
      if (!groups[key]) groups[key] = []
      groups[key].push(item as T)
    })
    return groups
  }, [filtered])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const handleSelect = (item: T) => {
    onSelect(item)
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(null)
  }

  const isEmpty = filtered.length === 0 && customFiltered.length === 0

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-[--clr-text-secondary] uppercase tracking-widest mb-2">
        {label}
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-[--radius-md] text-sm text-left transition-all duration-150"
        style={{
          backgroundColor: '#1a1d24',
          border: `1px solid ${open ? 'rgba(0,212,255,0.7)' : '#2a2d38'}`,
          boxShadow: open ? '0 0 0 3px rgba(0,212,255,0.08)' : 'none',
          color: selected ? '#f0f2f8' : '#4e5266',
        }}
      >
        <span className="truncate">
          {selected ? renderLabel(selected) : placeholder}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {selected && (
            <span
              role="button"
              onClick={handleClear}
              className="text-[--clr-text-muted] hover:text-[--clr-text-primary] transition-colors"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={15}
            className="text-[--clr-text-muted] transition-transform duration-150"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </div>
      </button>

      {/* Dropdown — fully opaque solid background */}
      {open && (
        <div
          className="absolute z-[60] top-full mt-1.5 w-full rounded-[--radius-md] overflow-hidden"
          style={{
            backgroundColor: '#0f1117',
            border: '1px solid #3d4158',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,255,0.06)',
          }}
        >
          {/* Search box */}
          <div
            className="flex items-center gap-2 px-3 py-2.5"
            style={{ borderBottom: '1px solid #2a2d38', backgroundColor: '#0f1117' }}
          >
            <Search size={13} className="text-[--clr-text-muted] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full text-sm outline-none"
              style={{ backgroundColor: 'transparent', color: '#f0f2f8' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[--clr-text-muted] hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Scrollable list */}
          <div className="max-h-72 overflow-y-auto" style={{ backgroundColor: '#0f1117' }}>

            {/* Custom items at top */}
            {customFiltered.length > 0 && (
              <div>
                <div
                  className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ backgroundColor: 'rgba(0,212,255,0.08)', color: '#00d4ff' }}
                >
                  ✦ Custom Components
                </div>
                {customFiltered.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors group"
                    style={{
                      backgroundColor: selected?.id === item.id ? 'rgba(0,212,255,0.12)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (selected?.id !== item.id)
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'
                    }}
                    onMouseLeave={e => {
                      if (selected?.id !== item.id)
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                    }}
                    onClick={() => handleSelect(item)}
                  >
                    <div>
                      <span className="text-sm" style={{ color: selected?.id === item.id ? '#00d4ff' : '#f0f2f8' }}>
                        {renderLabel(item)}
                      </span>
                      {renderMeta && (
                        <span className="ml-2 text-xs font-mono" style={{ color: '#4e5266' }}>
                          {renderMeta(item)}
                        </span>
                      )}
                    </div>
                    {onDeleteCustom && (
                      <button
                        onClick={e => { e.stopPropagation(); onDeleteCustom(item.id) }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-[--clr-text-muted] hover:text-[--clr-high]"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Standard grouped items */}
            {Object.entries(grouped).map(([group, groupItems]) => (
              <div key={group}>
                <div
                  className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ backgroundColor: '#0a0b0f', color: '#4e5266' }}
                >
                  {group}
                </div>
                {groupItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: selected?.id === item.id ? 'rgba(0,212,255,0.12)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (selected?.id !== item.id)
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'
                    }}
                    onMouseLeave={e => {
                      if (selected?.id !== item.id)
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                    }}
                    onClick={() => handleSelect(item)}
                  >
                    <span className="text-sm" style={{ color: selected?.id === item.id ? '#00d4ff' : '#f0f2f8' }}>
                      {renderLabel(item)}
                    </span>
                    {renderMeta && (
                      <span className="text-xs font-mono flex-shrink-0 ml-2" style={{ color: '#4e5266' }}>
                        {renderMeta(item)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {isEmpty && (
              <div className="px-4 py-8 text-sm text-center" style={{ color: '#4e5266' }}>
                No results for &quot;{search}&quot;
              </div>
            )}
          </div>

          {/* Add custom button */}
          {onAddCustom && (
            <div style={{ borderTop: '1px solid #2a2d38', backgroundColor: '#0a0b0f' }}>
              <button
                onClick={() => { setOpen(false); onAddCustom() }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors hover:bg-[rgba(0,212,255,0.06)]"
                style={{ color: '#00d4ff' }}
              >
                <Plus size={14} />
                Add Custom {label.includes('CPU') ? 'CPU' : 'GPU'}…
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
