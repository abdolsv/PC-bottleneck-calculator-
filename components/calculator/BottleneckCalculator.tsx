'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Zap, ChevronRight, Settings2, RotateCcw, BookmarkPlus, Bookmark,
} from 'lucide-react'
import { CPUs, GPUs, type CPU, type GPU, type UseCase } from '@/lib/hardware-data'
import { calculateBottleneck, type BottleneckResult, type RamSpeed } from '@/lib/bottleneck-engine'
import { ComponentSelector } from './ComponentSelector'
import { UseCaseSelector } from './UseCaseSelector'
import { ResultDisplay } from './ResultDisplay'
import { Button } from '@/components/ui/Button'
import { saveBuild, getSavedBuilds, type SavedBuild } from '@/lib/build-storage'

const RAM_OPTIONS = [8, 16, 32, 64] as const

const RAM_NOTES: Partial<Record<number, string>> = {
  8:  'Minimum',
  16: 'Recommended',
  32: 'Sweet spot',
  64: 'Pro / future-proof',
}

const RAM_SPEED_LABELS: Record<RamSpeed, string> = {
  'ddr4-3200': 'DDR4-3200',
  'ddr4-3600': 'DDR4-3600',
  'ddr5-5600': 'DDR5-5600',
  'ddr5-6000': 'DDR5-6000',
}

interface AdvancedOptions {
  cpuOverclock:    number
  gpuOverclock:    number
  ramSpeed:        RamSpeed
  thermalThrottle: boolean
}

const DEFAULT_ADVANCED: AdvancedOptions = {
  cpuOverclock:    0,
  gpuOverclock:    0,
  ramSpeed:        'ddr4-3200',
  thermalThrottle: false,
}

export default function BottleneckCalculator() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(null)
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null)
  const [useCase,     setUseCase]     = useState<UseCase>('gaming-1440p')
  const [ram,         setRam]         = useState<number>(16)

  const [result,       setResult]       = useState<BottleneckResult | null>(null)
  const [calculating,  setCalculating]  = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [savedBuilds,  setSavedBuilds]  = useState<SavedBuild[]>([])
  const [justSaved,    setJustSaved]    = useState(false)
  const [advanced,     setAdvanced]     = useState<AdvancedOptions>(DEFAULT_ADVANCED)

  const stateRef = useRef({ selectedCpu, selectedGpu, useCase, ram, advanced })

  useEffect(() => {
    stateRef.current = { selectedCpu, selectedGpu, useCase, ram, advanced }
  }, [selectedCpu, selectedGpu, useCase, ram, advanced])

  useEffect(() => {
    const cpuParam  = searchParams.get('cpu')
    const gpuParam  = searchParams.get('gpu')
    const useParam  = searchParams.get('use') as UseCase | null
    const ramParam  = searchParams.get('ram')

    if (cpuParam) setSelectedCpu(CPUs.find(c => c.id === cpuParam) ?? null)
    if (gpuParam) setSelectedGpu(GPUs.find(g => g.id === gpuParam) ?? null)
    if (useParam && useParam in { 'gaming-1080p':1,'gaming-1440p':1,'gaming-4k':1,'streaming':1,'video-editing':1,'general':1 }) {
      setUseCase(useParam)
    }
    if (ramParam) {
      const parsed = Number(ramParam)
      if (RAM_OPTIONS.includes(parsed as typeof RAM_OPTIONS[number])) setRam(parsed)
    }
  }, [searchParams])

  useEffect(() => {
    setSavedBuilds(getSavedBuilds())
  }, [])

  const handleCalculate = useCallback(() => {
    const currentInput = stateRef.current
    if (!currentInput.selectedCpu || !currentInput.selectedGpu) return
    
    setCalculating(true)

    setTimeout(() => {
      const freshInput = stateRef.current
      if (!freshInput.selectedCpu || !freshInput.selectedGpu) return

      const modifiedCpu: CPU = {
        ...freshInput.selectedCpu,
        benchmarkScore: Math.min(100,
          freshInput.selectedCpu.benchmarkScore
          * (1 + freshInput.advanced.cpuOverclock / 100)
          * (freshInput.advanced.thermalThrottle ? 0.92 : 1)
        ),
      }
      const modifiedGpu: GPU = {
        ...freshInput.selectedGpu,
        benchmarkScore: Math.min(100,
          freshInput.selectedGpu.benchmarkScore * (1 + freshInput.advanced.gpuOverclock / 100)
        ),
      }

      const res = calculateBottleneck(
        modifiedCpu,
        modifiedGpu,
        freshInput.useCase,
        freshInput.ram,
        freshInput.advanced.ramSpeed,
      )

      setResult(res)
      setCalculating(false)

      const params = new URLSearchParams({
        cpu: freshInput.selectedCpu.id,
        gpu: freshInput.selectedGpu.id,
        use: freshInput.useCase,
        ram: String(freshInput.ram),
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    }, 400)
  }, [router])

  const handleReset = () => {
    setSelectedCpu(null)
    setSelectedGpu(null)
    setUseCase('gaming-1440p')
    setRam(16)
    setResult(null)
    setAdvanced(DEFAULT_ADVANCED)
    router.replace('/', { scroll: false })
  }

  const handleSave = () => {
    if (!selectedCpu || !selectedGpu || !result) return
    saveBuild({
      name: `${selectedCpu.name.split(' ').slice(-1)[0]} + ${selectedGpu.name.split(' ').slice(-1)[0]}`,
      cpuId:   selectedCpu.id,
      gpuId:   selectedGpu.id,
      useCase,
      ram,
      result: {
        percentage:      result.percentage,
        label:           result.label,
        severity:        result.severity,
        efficiencyScore: result.efficiencyScore,
      },
    })
    setSavedBuilds(getSavedBuilds())
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const canCalculate  = !!selectedCpu && !!selectedGpu
  const hasResult     = !!result && !calculating
  const hasActiveOC   = advanced.cpuOverclock > 0 || advanced.gpuOverclock > 0

  return (
    <div className="space-y-4">
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--clr-text-secondary)' }}>
            Select Components
          </h2>
          {(selectedCpu || selectedGpu || result) && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: 'var(--clr-text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--clr-text-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--clr-text-muted)')}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <ComponentSelector<CPU>
            label="CPU (Processor)"
            items={CPUs}
            selected={selectedCpu}
            onSelect={setSelectedCpu}
            renderLabel={c => c.name}
            renderMeta={c => `${c.cores}C · ${c.boostClock}GHz`}
            placeholder="Search CPUs (Intel, AMD)..."
          />
          <ComponentSelector<GPU>
            label="GPU (Graphics Card)"
            items={GPUs}
            selected={selectedGpu}
            onSelect={setSelectedGpu}
            renderLabel={g => g.name}
            renderMeta={g => `${g.vram}GB VRAM`}
            placeholder="Search GPUs (NVIDIA, AMD)..."
          />
        </div>

        <UseCaseSelector selected={useCase} onChange={setUseCase} />

        <div className="mt-4">
          <label className="block text-xs font-medium uppercase tracking-widest mb-2"
                 style={{ color: 'var(--clr-text-secondary)' }}>
            System RAM
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RAM_OPTIONS.map(gb => {
              const active = ram === gb
              return (
                <button
                  key={gb}
                  type="button"
                  onClick={() => setRam(gb)}
                  className="py-2.5 rounded-md text-xs font-semibold border transition-all"
                  style={{
                    background:  active ? 'rgba(0,212,255,0.1)' : 'var(--clr-bg-elevated)',
                    borderColor: active ? 'rgba(0,212,255,0.6)' : 'var(--clr-border)',
                    color:       active ? '#00d4ff'              : 'var(--clr-text-secondary)',
                  }}
                >
                  {gb}GB
                  {RAM_NOTES[gb] && (
                    <span className="block text-[9px] opacity-60 mt-0.5">{RAM_NOTES[gb]}</span>
                  )}
                </button>
              )
            })}
          </div>
          {ram === 8 && (
            <p className="text-[11px] mt-2 flex items-center gap-1.5"
               style={{ color: 'var(--clr-medium)' }}>
              ⚠ 8 GB can cause stuttering in modern games — consider upgrading to 16 GB
            </p>
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-2 text-xs transition-colors py-1"
            style={{ color: 'var(--clr-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--clr-text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--clr-text-muted)')}
          >
            <Settings2 size={13} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            {hasActiveOC && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                    style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                ACTIVE
              </span>
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-xl border border-dashed space-y-4"
                 style={{ borderColor: 'var(--clr-border)' }}>
              <p className="text-xs" style={{ color: 'var(--clr-text-muted)' }}>
                Fine-tune with real-world modifiers. These affect benchmark scores and the bottleneck calculation.
              </p>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs" style={{ color: 'var(--clr-text-secondary)' }}>
                    CPU Overclock
                  </label>
                  <span className="text-xs font-mono" style={{ color: '#00d4ff' }}>
                    +{advanced.cpuOverclock}%
                  </span>
                </div>
                <input
                  type="range" min={0} max={30} step={5}
                  value={advanced.cpuOverclock}
                  onChange={e => setAdvanced(v => ({ ...v, cpuOverclock: Number(e.target.value) }))}
                  className="w-full accent-[#00d4ff]"
                />
                <div className="flex justify-between text-[10px] mt-0.5"
                     style={{ color: 'var(--clr-text-muted)' }}>
                  <span>Stock</span><span>+30% (extreme OC)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs" style={{ color: 'var(--clr-text-secondary)' }}>
                    GPU Overclock
                  </label>
                  <span className="text-xs font-mono" style={{ color: '#00d4ff' }}>
                    +{advanced.gpuOverclock}%
                  </span>
                </div>
                <input
                  type="range" min={0} max={20} step={5}
                  value={advanced.gpuOverclock}
                  onChange={e => setAdvanced(v => ({ ...v, gpuOverclock: Number(e.target.value) }))}
                  className="w-full accent-[#00d4ff]"
                />
                <div className="flex justify-between text-[10px] mt-0.5"
                     style={{ color: 'var(--clr-text-muted)' }}>
                  <span>Stock</span><span>+20% (heavy OC)</span>
                </div>
              </div>

              <div>
                <label className="text-xs block mb-1.5" style={{ color: 'var(--clr-text-secondary)' }}>
                  RAM Speed
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(Object.keys(RAM_SPEED_LABELS) as RamSpeed[]).map(speed => {
                    const active = advanced.ramSpeed === speed
                    return (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setAdvanced(v => ({ ...v, ramSpeed: speed }))}
                        className="py-2 text-[10px] font-medium rounded-md border transition-all"
                        style={{
                          background:  active ? 'rgba(0,212,255,0.08)' : 'var(--clr-bg)',
                          borderColor: active ? 'rgba(0,212,255,0.4)'  : 'var(--clr-border)',
                          color:       active ? '#00d4ff'                : 'var(--clr-text-secondary)',
                        }}
                      >
                        {RAM_SPEED_LABELS[speed]}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[10px] mt-1" style={{ color: 'var(--clr-text-muted)' }}>
                  Faster RAM boosts effective CPU score — most significant at 1080p and for AMD Ryzen.
                </p>
              </div>

              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: 'var(--clr-text-secondary)' }}>
                    CPU Thermal Throttling
                  </p>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--clr-text-muted)' }}>
                    Poor cooler or high ambient temps — applies ~8% CPU penalty
                  </p>
                </div>
                <div
                  role="switch"
                  aria-checked={advanced.thermalThrottle}
                  tabIndex={0}
                  className="w-10 h-5 rounded-full relative cursor-pointer flex-shrink-0 transition-colors"
                  style={{
                    background: advanced.thermalThrottle ? '#ef4444' : 'var(--clr-bg-elevated)',
                    border: '1px solid var(--clr-border)',
                  }}
                  onClick={() => setAdvanced(v => ({ ...v, thermalThrottle: !v.thermalThrottle }))}
                  onKeyDown={e => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      setAdvanced(v => ({ ...v, thermalThrottle: !v.thermalThrottle }))
                    }
                  }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                    style={{
                      background: 'white',
                      left: advanced.thermalThrottle ? 'calc(100% - 18px)' : '2px',
                    }}
                  />
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col xs:flex-row gap-2">
          <Button
            size="lg"
            className="flex-1"
            disabled={!canCalculate}
            loading={calculating}
            onClick={handleCalculate}
            rightIcon={<ChevronRight size={16} />}
            leftIcon={<Zap size={16} />}
          >
            {calculating ? 'Analysing Build…' : 'Calculate Bottleneck'}
          </Button>

          {hasResult && (
            <Button
              size="lg"
              variant="secondary"
              onClick={handleSave}
              leftIcon={justSaved ? <Bookmark size={16} /> : <BookmarkPlus size={16} />}
              className="xs:flex-shrink-0"
            >
              {justSaved ? 'Saved!' : 'Save'}
            </Button>
          )}
        </div>

        {!canCalculate && (
          <p className="text-[11px] text-center mt-2" style={{ color: 'var(--clr-text-muted)' }}>
            {!selectedCpu && !selectedGpu
              ? 'Select a CPU and GPU to get your bottleneck percentage'
              : !selectedCpu
              ? 'Select a CPU to continue'
              : 'Select a GPU to continue'}
          </p>
        )}
      </div>

      {result && selectedCpu && selectedGpu && !calculating && (
        <ResultDisplay result={result} cpu={selectedCpu} gpu={selectedGpu} />
      )}

      {savedBuilds.length > 0 && (
        <details className="card p-4">
          <summary className="text-xs font-semibold uppercase tracking-widest cursor-pointer select-none list-none flex items-center gap-2"
                   style={{ color: 'var(--clr-text-secondary)' }}>
            <Bookmark size={13} />
            Saved Builds ({savedBuilds.length})
          </summary>
          <div className="mt-3 space-y-2">
            {savedBuilds.map(build => (
              <div
                key={build.id}
                className="flex items-center justify-between py-2 border-t gap-3"
                style={{ borderColor: 'var(--clr-border)' }}
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--clr-text-primary)' }}>
                    {build.name}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--clr-text-muted)' }}>
                    {build.result.label} · {build.result.percentage}% bottleneck
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const cpu = CPUs.find(c => c.id === build.cpuId)
                    const gpu = GPUs.find(g => g.id === build.gpuId)
                    if (cpu) setSelectedCpu(cpu)
                    if (gpu) setSelectedGpu(gpu)
                    setUseCase(build.useCase as UseCase)
                    setRam(build.ram)
                    setResult(null)
                  }}
                  className="flex-shrink-0 px-2 py-1 rounded text-xs border transition-colors"
                  style={{
                    color: '#00d4ff',
                    borderColor: 'rgba(0,212,255,0.3)',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
