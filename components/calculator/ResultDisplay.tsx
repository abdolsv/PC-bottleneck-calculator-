// components/calculator/ResultDisplay.tsx
'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Share2, Check, TrendingUp, AlertTriangle } from 'lucide-react'
import type { BottleneckResult } from '@/lib/bottleneck-engine'
import type { CPU, GPU } from '@/lib/hardware-data'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type SeverityBadge = 'ok' | 'low' | 'medium' | 'high' | 'critical'

const severityToBadge: Record<string, SeverityBadge> = {
  none: 'ok', low: 'low', medium: 'medium', high: 'high', critical: 'critical',
}

// Simple affiliate link map — replace with your actual Amazon affiliate links
const AFFILIATE_UPGRADES: Record<string, { name: string; link: string; price: string }> = {
  'i5-13600k': { name: 'Intel Core i5-13600K', link: 'https://amzn.to/XXXXX', price: '~$280' },
  'i7-14700k': { name: 'Intel Core i7-14700K', link: 'https://amzn.to/XXXXX', price: '~$380' },
  'r7-7700x':  { name: 'AMD Ryzen 7 7700X',    link: 'https://amzn.to/XXXXX', price: '~$320' },
  'rtx-4070':  { name: 'NVIDIA RTX 4070 Super', link: 'https://amzn.to/XXXXX', price: '~$599' },
  'rtx-4060ti':{ name: 'NVIDIA RTX 4060 Ti',   link: 'https://amzn.to/XXXXX', price: '~$399' },
  'rx-7800xt': { name: 'AMD RX 7800 XT',       link: 'https://amzn.to/XXXXX', price: '~$449' },
}

interface ResultDisplayProps {
  result: BottleneckResult
  cpu: CPU
  gpu: GPU
  onShare?: () => void
}

export function ResultDisplay({ result, cpu, gpu, onShare }: ResultDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}?cpu=${cpu.id}&gpu=${gpu.id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onShare?.()
  }

  const badgeVariant = severityToBadge[result.severity]
  const isBottlenecked = result.severity !== 'none'

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main result card */}
      <div className="card-elevated p-6 relative overflow-hidden">
        {/* Glow effect behind percentage */}
        <div
          className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ backgroundColor: `var(${result.color})` }}
        />

        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge variant={badgeVariant} dot>{result.label}</Badge>
            <h2 className="text-2xl font-bold mt-2">
              {result.bottlenecker === 'Balanced'
                ? '✓ Balanced Build'
                : `${result.bottlenecker} Bottleneck`}
            </h2>
            <p className="text-sm text-[--clr-text-secondary] mt-1">{result.recommendation}</p>
          </div>

          {/* Big percentage */}
          <div className="text-right">
            <p
              className="text-5xl font-mono font-bold tabular-nums"
              style={{ color: `var(${result.color})` }}
            >
              {result.percentage}%
            </p>
            <p className="text-xs text-[--clr-text-muted]">bottleneck</p>
          </div>
        </div>

        {/* Bottleneck progress bar */}
        <ProgressBar
          value={result.percentage}
          color={result.color}
          height={10}
          showValue
          label="Bottleneck Severity"
          className="mb-6"
        />

        {/* CPU vs GPU utilization */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[--clr-bg] rounded-[--radius-md] p-4">
            <p className="text-xs text-[--clr-text-muted] mb-1">CPU Utilization</p>
            <p className="text-xl font-mono font-bold text-[--clr-text-primary]">{result.cpuUtilization}%</p>
            <p className="text-xs text-[--clr-text-secondary] truncate">{cpu.name}</p>
            <ProgressBar value={result.cpuUtilization} color="--clr-accent" height={4} className="mt-2" />
          </div>
          <div className="bg-[--clr-bg] rounded-[--radius-md] p-4">
            <p className="text-xs text-[--clr-text-muted] mb-1">GPU Utilization</p>
            <p className="text-xl font-mono font-bold text-[--clr-text-primary]">{result.gpuUtilization}%</p>
            <p className="text-xs text-[--clr-text-secondary] truncate">{gpu.name}</p>
            <ProgressBar value={result.gpuUtilization} color="--clr-low" height={4} className="mt-2" />
          </div>
        </div>

        {/* Efficiency score */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[--clr-text-secondary]">Build Efficiency Score</span>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-[--clr-accent]" />
            <span className="font-mono font-semibold text-[--clr-accent]">{result.efficiencyScore}/100</span>
          </div>
        </div>
      </div>

      {/* Affiliate upgrade recommendation */}
      {isBottlenecked && (
        <div className="card p-5 border-l-4" style={{ borderLeftColor: `var(${result.color})` }}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} style={{ color: `var(${result.color})` }} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">Recommended Upgrade: {result.upgradeTarget}</p>
              <p className="text-xs text-[--clr-text-secondary] mb-3">
                Upgrading your {result.upgradeTarget} will eliminate this bottleneck and unlock your full build potential.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(AFFILIATE_UPGRADES)
                  .filter(([, v]) => v.name.toLowerCase().includes(result.upgradeTarget.toLowerCase()))
                  .slice(0, 2)
                  .map(([key, product]) => (
                    <a
                      key={key}
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[--radius-sm] bg-[--clr-bg-elevated] border border-[--clr-border] text-[--clr-accent] hover:border-[--clr-accent] transition-colors"
                    >
                      {product.name} · {product.price} →
                    </a>
                  ))}
              </div>
              <p className="text-[10px] text-[--clr-text-muted] mt-2">* Affiliate links. We earn a small commission at no cost to you.</p>
            </div>
          </div>
        </div>
      )}

      {/* Details toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[--clr-bg-card] border border-[--clr-border] rounded-[--radius-md] text-sm text-[--clr-text-secondary] hover:text-[--clr-text-primary] hover:border-[--clr-border-glow] transition-all"
      >
        <span>Technical Details</span>
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showDetails && (
        <div className="card p-4 space-y-2">
          {result.details.map((detail, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-[--clr-accent] font-mono mt-0.5">›</span>
              <span className="text-[--clr-text-secondary]">{detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Share */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={copied ? <Check size={14} /> : <Share2 size={14} />}
          onClick={handleShare}
        >
          {copied ? 'Link Copied!' : 'Share Result'}
        </Button>
      </div>
    </div>
  )
}
