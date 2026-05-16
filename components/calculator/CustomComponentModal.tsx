// components/calculator/CustomComponentModal.tsx
'use client'
import { useState } from 'react'
import { X, Plus, Cpu, Monitor } from 'lucide-react'
import type { CPU, GPU } from '@/lib/hardware-data'
import { saveCustomCPU, saveCustomGPU, makeCustomCPUId, makeCustomGPUID } from '@/lib/custom-hardware'
import { Button } from '@/components/ui/Button'

interface Props {
  type: 'cpu' | 'gpu'
  onClose: () => void
  onSave: (component: CPU | GPU) => void
}

export function CustomComponentModal({ type, onClose, onSave }: Props) {
  const isCpu = type === 'cpu'

  const [form, setForm] = useState({
    name:           '',
    brand:          isCpu ? 'Intel' : 'NVIDIA',
    generation:     '',
    cores:          '8',
    threads:        '16',
    baseClock:      '3.5',
    boostClock:     '5.0',
    tdp:            '125',
    socket:         'LGA1700',
    benchmarkScore: '70',
    releaseYear:    '2024',
    vram:           '12',
    targetRes:      '1440p',
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const labelCls = 'block text-xs font-medium text-[--clr-text-secondary] uppercase tracking-widest mb-1.5'
  const inputCls = 'w-full px-3 py-2 rounded-[--radius-sm] bg-[--clr-bg] border border-[--clr-border] text-sm text-[--clr-text-primary] focus:outline-none focus:border-[--clr-accent] transition-colors'
  const selectCls = inputCls

  function handleSave() {
    if (!form.name.trim()) return

    if (isCpu) {
      const cpu: CPU = {
        id:             makeCustomCPUId(form.name),
        name:           form.name.trim(),
        brand:          form.brand as 'Intel' | 'AMD',
        generation:     form.generation || 'Custom',
        cores:          Number(form.cores),
        threads:        Number(form.threads),
        baseClock:      Number(form.baseClock),
        boostClock:     Number(form.boostClock),
        tdp:            Number(form.tdp),
        tier:           3,
        benchmarkScore: Math.min(100, Math.max(1, Number(form.benchmarkScore))),
        releaseYear:    Number(form.releaseYear),
        socket:         form.socket || 'Unknown',
      }
      saveCustomCPU(cpu)
      onSave(cpu)
    } else {
      const gpu: GPU = {
        id:               makeCustomGPUID(form.name),
        name:             form.name.trim(),
        brand:            form.brand as 'NVIDIA' | 'AMD' | 'Intel',
        vram:             Number(form.vram),
        tier:             3,
        benchmarkScore:   Math.min(100, Math.max(1, Number(form.benchmarkScore))),
        tdp:              Number(form.tdp),
        releaseYear:      Number(form.releaseYear),
        targetResolution: form.targetRes as '1080p' | '1440p' | '4K' | 'all',
      }
      saveCustomGPU(gpu)
      onSave(gpu)
    }

    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-lg rounded-[--radius-lg] border border-[--clr-border-glow] overflow-hidden"
        style={{ background: '#111318' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--clr-border]">
          <div className="flex items-center gap-2">
            {isCpu ? <Cpu size={16} className="text-[--clr-accent]" /> : <Monitor size={16} className="text-[--clr-ok]" />}
            <h2 className="font-semibold text-sm">
              Add Custom {isCpu ? 'CPU' : 'GPU'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[--clr-text-muted] hover:text-[--clr-text-primary] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-[--clr-text-muted]">
            Enter your component specs. The benchmark score (0–100) determines the bottleneck calculation.
            Compare your part to entries in our database for reference.
          </p>

          {/* Name */}
          <div>
            <label className={labelCls}>Component Name *</label>
            <input
              className={inputCls}
              placeholder={isCpu ? 'e.g. Intel Core i5-14400F' : 'e.g. RTX 4060 Ti 16GB'}
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Brand */}
            <div>
              <label className={labelCls}>Brand</label>
              <select className={selectCls} value={form.brand} onChange={e => set('brand', e.target.value)}>
                {isCpu
                  ? <><option>Intel</option><option>AMD</option></>
                  : <><option>NVIDIA</option><option>AMD</option><option>Intel</option></>
                }
              </select>
            </div>

            {/* Benchmark Score — most important! */}
            <div>
              <label className={labelCls}>Benchmark Score (0–100) *</label>
              <input
                type="number" min={1} max={100}
                className={inputCls}
                placeholder="e.g. 75"
                value={form.benchmarkScore}
                onChange={e => set('benchmarkScore', e.target.value)}
              />
            </div>

            {/* TDP */}
            <div>
              <label className={labelCls}>TDP (Watts)</label>
              <input type="number" className={inputCls} value={form.tdp} onChange={e => set('tdp', e.target.value)} />
            </div>

            {/* Release Year */}
            <div>
              <label className={labelCls}>Release Year</label>
              <input type="number" className={inputCls} value={form.releaseYear} onChange={e => set('releaseYear', e.target.value)} />
            </div>
          </div>

          {isCpu ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Cores</label>
                  <input type="number" className={inputCls} value={form.cores} onChange={e => set('cores', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Threads</label>
                  <input type="number" className={inputCls} value={form.threads} onChange={e => set('threads', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Base Clock (GHz)</label>
                  <input type="number" step="0.1" className={inputCls} value={form.baseClock} onChange={e => set('baseClock', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Boost Clock (GHz)</label>
                  <input type="number" step="0.1" className={inputCls} value={form.boostClock} onChange={e => set('boostClock', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Socket</label>
                  <select className={selectCls} value={form.socket} onChange={e => set('socket', e.target.value)}>
                    <option>LGA1700</option><option>LGA1851</option>
                    <option>AM4</option><option>AM5</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Generation / Series</label>
                  <input className={inputCls} placeholder="e.g. 14th Gen" value={form.generation} onChange={e => set('generation', e.target.value)} />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>VRAM (GB)</label>
                <input type="number" className={inputCls} value={form.vram} onChange={e => set('vram', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Target Resolution</label>
                <select className={selectCls} value={form.targetRes} onChange={e => set('targetRes', e.target.value)}>
                  <option>1080p</option><option>1440p</option><option>4K</option><option>all</option>
                </select>
              </div>
            </div>
          )}

          <div className="text-xs text-[--clr-text-muted] p-3 rounded-[--radius-sm] border border-[--clr-border]" style={{ background: 'rgba(0,212,255,0.05)' }}>
            <strong className="text-[--clr-accent]">Score guide:</strong> RTX 4090 = 100, RTX 4070 Super = 72, RTX 4060 = 50 | i9-14900K = 97, i5-13600K = 77, i3-12100F = 45
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[--clr-border] flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!form.name.trim()}
            onClick={handleSave}
            leftIcon={<Plus size={14} />}
          >
            Add {isCpu ? 'CPU' : 'GPU'}
          </Button>
        </div>
      </div>
    </div>
  )
}
