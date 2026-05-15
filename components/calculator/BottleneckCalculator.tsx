// components/calculator/BottleneckCalculator.tsx
'use client'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Zap, ChevronRight } from 'lucide-react'
import { CPUs, GPUs, type CPU, type GPU, type UseCase } from '@/lib/hardware-data'
import { calculateBottleneck, type BottleneckResult } from '@/lib/bottleneck-engine'
import { ComponentSelector } from './ComponentSelector'
import { UseCaseSelector } from './UseCaseSelector'
import { ResultDisplay } from './ResultDisplay'
import { Button } from '@/components/ui/Button'

const RAM_OPTIONS = [8, 16, 32, 64]

export default function BottleneckCalculator() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(null)
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null)
  const [useCase, setUseCase] = useState<UseCase>('gaming-1440p')
  const [ram, setRam] = useState<number>(16)
  const [result, setResult] = useState<BottleneckResult | null>(null)
  const [calculating, setCalculating] = useState(false)

  // Pre-fill from URL params (shareable links)
  useEffect(() => {
    const cpuParam = searchParams.get('cpu')
    const gpuParam = searchParams.get('gpu')
    const useParam = searchParams.get('use') as UseCase
    const ramParam = searchParams.get('ram')

    if (cpuParam) setSelectedCpu(CPUs.find(c => c.id === cpuParam) ?? null)
    if (gpuParam) setSelectedGpu(GPUs.find(g => g.id === gpuParam) ?? null)
    if (useParam) setUseCase(useParam)
    if (ramParam) setRam(Number(ramParam))
  }, [searchParams])

  const handleCalculate = useCallback(() => {
    if (!selectedCpu || !selectedGpu) return
    setCalculating(true)

    // Simulate slight delay for UX (makes it feel like computation)
    setTimeout(() => {
      const res = calculateBottleneck(selectedCpu, selectedGpu, useCase, ram)
      setResult(res)
      setCalculating(false)

      // Update URL for shareability
      const params = new URLSearchParams({
        cpu: selectedCpu.id,
        gpu: selectedGpu.id,
        use: useCase,
        ram: String(ram),
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    }, 400)
  }, [selectedCpu, selectedGpu, useCase, ram, router])

  const canCalculate = !!selectedCpu && !!selectedGpu

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[--clr-text-secondary] mb-5">
          Select Your Components
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <ComponentSelector<CPU>
            label="CPU"
            items={CPUs}
            selected={selectedCpu}
            onSelect={setSelectedCpu}
            renderLabel={c => c.name}
            renderMeta={c => `${c.cores}C · ${c.boostClock}GHz`}
            placeholder="Search CPUs..."
          />
          <ComponentSelector<GPU>
            label="GPU"
            items={GPUs}
            selected={selectedGpu}
            onSelect={setSelectedGpu}
            renderLabel={g => g.name}
            renderMeta={g => `${g.vram}GB VRAM`}
            placeholder="Search GPUs..."
          />
        </div>

        <UseCaseSelector selected={useCase} onChange={setUseCase} />

        {/* RAM selector */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-[--clr-text-secondary] uppercase tracking-widest mb-2">
            System RAM
          </label>
          <div className="flex gap-2">
            {RAM_OPTIONS.map(gb => (
              <button
                key={gb}
                onClick={() => setRam(gb)}
                className={`
                  flex-1 py-2 rounded-[--radius-sm] text-xs font-medium border transition-all
                  ${ram === gb
                    ? 'bg-[--clr-accent-dim] border-[--clr-accent] text-[--clr-accent]'
                    : 'bg-[--clr-bg-elevated] border-[--clr-border] text-[--clr-text-secondary] hover:border-[--clr-border-glow]'
                  }
                `}
              >
                {gb}GB
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Button
            size="lg"
            className="w-full"
            disabled={!canCalculate}
            loading={calculating}
            onClick={handleCalculate}
            rightIcon={<ChevronRight size={16} />}
            leftIcon={<Zap size={16} />}
          >
            {calculating ? 'Analyzing...' : 'Calculate Bottleneck'}
          </Button>
          {!canCalculate && (
            <p className="text-xs text-[--clr-text-muted] text-center mt-2">
              Select both a CPU and GPU to continue
            </p>
          )}
        </div>
      </div>

      {/* Result */}
      {result && selectedCpu && selectedGpu && !calculating && (
        <ResultDisplay result={result} cpu={selectedCpu} gpu={selectedGpu} />
      )}
    </div>
  )
}
