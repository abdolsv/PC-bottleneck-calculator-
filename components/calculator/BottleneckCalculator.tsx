// components/calculator/BottleneckCalculator.tsx
'use client'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Zap, ChevronRight, Settings2, RotateCcw, BookmarkPlus, Bookmark
} from 'lucide-react'
import { CPUs, GPUs, type CPU, type GPU, type UseCase } from '@/lib/hardware-data'
import { calculateBottleneck, type BottleneckResult } from '@/lib/bottleneck-engine'
import { ComponentSelector } from './ComponentSelector'
import { UseCaseSelector } from './UseCaseSelector'
import { ResultDisplay } from './ResultDisplay'
import { Button } from '@/components/ui/Button'
import { saveBuild, getSavedBuilds, type SavedBuild } from '@/lib/build-storage'

const RAM_OPTIONS = [8, 16, 32, 64]

// Advanced options type
interface AdvancedOptions {
  cpuOverclock:  number  // % boost e.g. 10 = +10%
  gpuOverclock:  number  // % boost
  ramSpeed:      'ddr4-3200' | 'ddr4-3600' | 'ddr5-5600' | 'ddr5-6000'
  thermalThrottle: boolean
}

const RAM_SPEED_BONUS: Record<string, number> = {
  'ddr4-3200': 0,
  'ddr4-3600': 2,
  'ddr5-5600': 4,
  'ddr5-6000': 6,
}

const RAM_SPEED_LABELS: Record<string, string> = {
  'ddr4-3200': 'DDR4-3200',
  'ddr4-3600': 'DDR4-3600',
  'ddr5-5600': 'DDR5-5600',
  'ddr5-6000': 'DDR5-6000',
}

export default function BottleneckCalculator() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(null)
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null)
  const [useCase, setUseCase] = useState<UseCase>('gaming-1440p')
  const [ram, setRam] = useState<number>(16)
  const [result, setResult] = useState<BottleneckResult | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([])
  const [justSaved, setJustSaved] = useState(false)

  const [advanced, setAdvanced] = useState<AdvancedOptions>({
    cpuOverclock:    0,
    gpuOverclock:    0,
    ramSpeed:        'ddr4-3200',
    thermalThrottle: false,
  })

  // Load from URL params on mount
  useEffect(() => {
    const cpuParam  = searchParams.get('cpu')
    const gpuParam  = searchParams.get('gpu')
    const useParam  = searchParams.get('use') as UseCase
    const ramParam  = searchParams.get('ram')

    if (cpuParam) setSelectedCpu(CPUs.find(c => c.id === cpuParam) ?? null)
    if (gpuParam) setSelectedGpu(GPUs.find(g => g.id === gpuParam) ?? null)
    if (useParam) setUseCase(useParam)
    if (ramParam) setRam(Number(ramParam))
  }, [searchParams])

  // Load saved builds
  useEffect(() => {
    setSavedBuilds(getSavedBuilds())
  }, [])

  const handleCalculate = useCallback(() => {
    if (!selectedCpu || !selectedGpu) return
    setCalculating(true)

    setTimeout(() => {
      // Apply overclocking and thermal throttle modifiers to a copy of the components
      const modifiedCpu = {
        ...selectedCpu,
        benchmarkScore: Math.min(100,
          selectedCpu.benchmarkScore *
          (1 + advanced.cpuOverclock / 100) *
          (advanced.thermalThrottle ? 0.92 : 1)
        ),
      }
      const modifiedGpu = {
        ...selectedGpu,
        benchmarkScore: Math.min(100,
          selectedGpu.benchmarkScore * (1 + advanced.gpuOverclock / 100)
        ),
      }

      // RAM speed gives a small performance boost in memory-sensitive games
      const ramSpeedBonus = RAM_SPEED_BONUS[advanced.ramSpeed] ?? 0

      const res = calculateBottleneck(modifiedCpu, modifiedGpu, useCase, ram)

      // Apply RAM speed bonus (reduces bottleneck slightly)
      const finalResult: BottleneckResult = {
        ...res,
        percentage: Math.max(0, res.percentage - ramSpeedBonus),
        efficiencyScore: Math.min(100, res.efficiencyScore + ramSpeedBonus),
      }

      setResult(finalResult)
      setCalculating(false)

      // Update URL for shareability
      const params = new URLSearchParams({
        cpu: selectedCpu.id, gpu: selectedGpu.id,
        use: useCase, ram: String(ram),
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    }, 450)
  }, [selectedCpu, selectedGpu, useCase, ram, advanced, router])

  const handleReset = () => {
    setSelectedCpu(null)
    setSelectedGpu(null)
    setUseCase('gaming-1440p')
    setRam(16)
    setResult(null)
    setAdvanced({ cpuOverclock: 0, gpuOverclock: 0, ramSpeed: 'ddr4-3200', thermalThrottle: false })
    router.replace('/', { scroll: false })
  }

  const handleSave = () => {
    if (!selectedCpu || !selectedGpu || !result) return
    const saved = saveBuild({
      name: `${selectedCpu.name.split(' ').slice(-1)[0]} + ${selectedGpu.name.split(' ').slice(-1)[0]}`,
      cpuId: selectedCpu.id, gpuId: selectedGpu.id,
      useCase, ram,
      result: {
        percentage:     result.percentage,
        label:          result.label,
        severity:       result.severity,
        efficiencyScore: result.efficiencyScore,
      },
    })
    setSavedBuilds(getSavedBuilds())
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const canCalculate = !!selectedCpu && !!selectedGpu
  const hasResult = !!result && !calculating

  return (
    <div className="space-y-4">

      {/* ─── Input card ─────────────────────────────────────────────────────── */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[--clr-text-secondary]">
            Select Components
          </h2>
          {(selectedCpu || selectedGpu || result) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-[--clr-text-muted] hover:text-[--clr-text-secondary] transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>

        {/* CPU + GPU selectors */}
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
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

        {/* Use case */}
        <UseCaseSelector selected={useCase} onChange={setUseCase} />

        {/* RAM */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-[--clr-text-secondary] uppercase tracking-widest mb-2">
            System RAM
          </label>
          <div className="flex gap-2">
            {RAM_OPTIONS.map(gb => (
              <button
                key={gb}
                onClick={() => setRam(gb)}
                className="flex-1 py-2.5 rounded-[--radius-sm] text-xs font-semibold border transition-all"
                style={{
                  background: ram === gb ? 'rgba(0,212,255,0.1)' : 'var(--clr-bg-elevated)',
                  borderColor: ram === gb ? 'rgba(0,212,255,0.6)' : 'var(--clr-border)',
                  color: ram === gb ? '#00d4ff' : 'var(--clr-text-secondary)',
                }}
              >
                {gb}GB
                {gb === 16 && <span className="block text-[9px] opacity-60 mt-0.5">Recommended</span>}
                {gb === 32 && <span className="block text-[9px] opacity-60 mt-0.5">Sweet spot</span>}
              </button>
            ))}
          </div>
          {ram === 8 && (
            <p className="text-[11px] text-[--clr-medium] mt-2 flex items-center gap-1.5">
              ⚠ 8GB RAM can cause stuttering in modern games — consider upgrading to 16GB
            </p>
          )}
        </div>

        {/* Advanced options toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-2 text-xs text-[--clr-text-muted] hover:text-[--clr-text-secondary] transition-colors py-1"
          >
            <Settings2 size={13} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            {(advanced.cpuOverclock > 0 || advanced.gpuOverclock > 0) && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                ACTIVE
              </span>
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-[--radius-md] border border-dashed border-[--clr-border] space-y-4">
              <p className="text-xs text-[--clr-text-muted]">
                Fine-tune with real-world modifiers. These affect your benchmark scores and bottleneck calculation.
              </p>

              {/* CPU OC slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-[--clr-text-secondary]">CPU Overclock</label>
                  <span className="text-xs font-mono text-[--clr-accent]">
                    +{advanced.cpuOverclock}%
                  </span>
                </div>
                <input
                  type="range" min={0} max={30} step={5}
                  value={advanced.cpuOverclock}
                  onChange={e => setAdvanced(v => ({ ...v, cpuOverclock: Number(e.target.value) }))}
                  className="w-full accent-[--clr-accent]"
                />
                <div className="flex justify-between text-[10px] text-[--clr-text-muted] mt-0.5">
                  <span>Stock</span><span>+30% (extreme OC)</span>
                </div>
              </div>

              {/* GPU OC slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-[--clr-text-secondary]">GPU Overclock</label>
                  <span className="text-xs font-mono text-[--clr-accent]">
                    +{advanced.gpuOverclock}%
                  </span>
                </div>
                <input
                  type="range" min={0} max={20} step={5}
                  value={advanced.gpuOverclock}
                  onChange={e => setAdvanced(v => ({ ...v, gpuOverclock: Number(e.target.value) }))}
                  className="w-full accent-[--clr-accent]"
                />
                <div className="flex justify-between text-[10px] text-[--clr-text-muted] mt-0.5">
                  <span>Stock</span><span>+20% (heavy OC)</span>
                </div>
              </div>

              {/* RAM speed */}
              <div>
                <label className="text-xs text-[--clr-text-secondary] mb-1.5 block">RAM Speed</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(Object.keys(RAM_SPEED_LABELS) as (keyof typeof RAM_SPEED_LABELS)[]).map(speed => (
                    <button
                      key={speed}
                      onClick={() => setAdvanced(v => ({ ...v, ramSpeed: speed as AdvancedOptions['ramSpeed'] }))}
                      className="py-2 text-[10px] font-medium rounded-[--radius-sm] border transition-all"
                      style={{
                        background: advanced.ramSpeed === speed ? 'rgba(0,212,255,0.08)' : 'var(--clr-bg)',
                        borderColor: advanced.ramSpeed === speed ? 'rgba(0,212,255,0.4)' : 'var(--clr-border)',
                        color: advanced.ramSpeed === speed ? '#00d4ff' : 'var(--clr-text-secondary)',
                      }}
                    >
                      {RAM_SPEED_LABELS[speed]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thermal throttle toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs text-[--clr-text-secondary]">CPU Thermal Throttling</p>
                  <p className="text-[10px] text-[--clr-text-muted]">
                    Poor cooler or high ambient temps — applies ~8% performance penalty
                  </p>
                </div>
                <div
                  className="w-10 h-5 rounded-full relative transition-colors cursor-pointer flex-shrink-0"
                  style={{
                    background: advanced.thermalThrottle ? '#ef4444' : 'var(--clr-bg-elevated)',
                    border: '1px solid var(--clr-border)',
                  }}
                  onClick={() => setAdvanced(v => ({ ...v, thermalThrottle: !v.thermalThrottle }))}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
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

        {/* CTA */}
        <div className="mt-5 flex gap-2">
          <Button
            size="lg"
            className="flex-1"
            disabled={!canCalculate}
            loading={calculating}
            onClick={handleCalculate}
            rightIcon={<ChevronRight size={16} />}
            leftIcon={<Zap size={16} />}
          >
            {calculating ? 'Analyzing Build...' : 'Calculate Bottleneck'}
          </Button>

          {hasResult && (
            <Button
              size="lg"
              variant="secondary"
              onClick={handleSave}
              leftIcon={justSaved ? <Bookmark size={16} /> : <BookmarkPlus size={16} />}
              className="flex-shrink-0"
            >
              {justSaved ? 'Saved!' : 'Save'}
            </Button>
          )}
        </div>

        {!canCalculate && (
          <p className="text-[11px] text-[--clr-text-muted] text-center mt-2">
            {!selectedCpu && !selectedGpu
              ? 'Select a CPU and GPU to get your bottleneck percentage'
              : !selectedCpu
              ? 'Select a CPU to continue'
              : 'Select a GPU to continue'}
          </p>
        )}
      </div>

      {/* ─── Result ─────────────────────────────────────────────────────────── */}
      {result && selectedCpu && selectedGpu && !calculating && (
        <ResultDisplay result={result} cpu={selectedCpu} gpu={selectedGpu} />
      )}

      {/* ─── Saved builds ────────────────────────────────────────────────────── */}
      {savedBuilds.length > 0 && (
        <details className="card p-4">
          <summary className="text-xs font-semibold uppercase tracking-widest text-[--clr-text-secondary] cursor-pointer select-none list-none flex items-center gap-2">
            <Bookmark size={13} />
            Saved Builds ({savedBuilds.length})
          </summary>
          <div className="mt-3 space-y-2">
            {savedBuilds.map(build => (
              <div
                key={build.id}
                className="flex items-center justify-between py-2 border-t border-[--clr-border] text-xs"
              >
                <div>
                  <p className="font-medium text-[--clr-text-primary]">{build.name}</p>
                  <p className="text-[--clr-text-muted]">{build.result.label} · {build.result.percentage}% bottleneck</p>
                </div>
                <button
                  onClick={() => {
                    const cpu = CPUs.find(c => c.id === build.cpuId)
                    const gpu = GPUs.find(g => g.id === build.gpuId)
                    if (cpu) setSelectedCpu(cpu)
                    if (gpu) setSelectedGpu(gpu)
                    setUseCase(build.useCase as UseCase)
                    setRam(build.ram)
                  }}
                  className="px-2 py-1 rounded-[--radius-sm] text-[--clr-accent] border border-[rgba(0,212,255,0.3)] hover:bg-[rgba(0,212,255,0.08)] transition-colors"
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
