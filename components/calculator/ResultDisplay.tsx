'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Share2, Check, TrendingUp, AlertTriangle } from 'lucide-react'
import type { BottleneckResult } from '@/lib/bottleneck-engine'
import type { CPU, GPU } from '@/lib/hardware-data'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AmazonButton } from '@/components/ui/AmazonButton'

type SeverityBadge = 'ok' | 'low' | 'medium' | 'high' | 'critical'

const severityToBadge: Record<string, SeverityBadge> = {
  none: 'ok', low: 'low', medium: 'medium', high: 'high', critical: 'critical',
}

/**
 * Build a human-readable Amazon search query from the upgrade target label.
 * e.g. "CPU" → "Intel Core i7-14700K processor" using the actual component name.
 * Falls back to a generic search if names aren't available.
 */
function buildUpgradeQuery(
  upgradeTarget: string,
  cpu: CPU,
  gpu: GPU,
): string {
  const target = upgradeTarget.toLowerCase()
  if (target === 'cpu' || target.includes('processor')) {
    return `${cpu.name} upgrade CPU processor`
  }
  if (target === 'gpu' || target.includes('graphics') || target.includes('card')) {
    return `${gpu.name} upgrade graphics card`
  }
  // Fallback: use the label as-is
  return `${upgradeTarget} PC component upgrade`
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
  const upgradeQuery = buildUpgradeQuery(result.upgradeTarget, cpu, gpu)

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ─── Main result card ─────────────────────────────────────────── */}
      <div className="card-elevated p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle glow behind percentage */}
        <div
          className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ backgroundColor: `var(${result.color})` }}
        />

        {/* Header row — stacks on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <Badge variant={badgeVariant} dot>{result.label}</Badge>
            <h2 className="text-xl sm:text-2xl font-bold mt-2 leading-snug">
              {result.bottlenecker === 'Balanced'
                ? '✓ Balanced Build'
                : `${result.bottlenecker} Bottleneck`}
            </h2>
            <p className="text-xs sm:text-sm text-[--clr-text-secondary] mt-1 leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          {/* Percentage — large but constrained on mobile */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-0 flex-shrink-0">
            <p
              className="text-4xl sm:text-5xl font-mono font-bold tabular-nums"
              style={{ color: `var(${result.color})` }}
            >
              {result.percentage}%
            </p>
            <p className="text-xs text-[--clr-text-muted] sm:text-right">bottleneck</p>
          </div>
        </div>

        {/* Bottleneck bar */}
        <ProgressBar
          value={result.percentage}
          color={result.color}
          height={10}
          showValue
          label="Bottleneck Severity"
          className="mb-6"
        />

        {/* CPU vs GPU utilization */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="bg-[--clr-bg] rounded-[--radius-md] p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-[--clr-text-muted] mb-1">CPU Utilization</p>
            <p className="text-lg sm:text-xl font-mono font-bold text-[--clr-text-primary]">
              {result.cpuUtilization}%
            </p>
            <p className="text-[10px] sm:text-xs text-[--clr-text-secondary] truncate">{cpu.name}</p>
            <ProgressBar value={result.cpuUtilization} color="--clr-accent" height={4} className="mt-2" />
          </div>
          <div className="bg-[--clr-bg] rounded-[--radius-md] p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-[--clr-text-muted] mb-1">GPU Utilization</p>
            <p className="text-lg sm:text-xl font-mono font-bold text-[--clr-text-primary]">
              {result.gpuUtilization}%
            </p>
            <p className="text-[10px] sm:text-xs text-[--clr-text-secondary] truncate">{gpu.name}</p>
            <ProgressBar value={result.gpuUtilization} color="--clr-low" height={4} className="mt-2" />
          </div>
        </div>

        {/* Efficiency score */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[--clr-text-secondary] text-xs sm:text-sm">Build Efficiency Score</span>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-[--clr-accent]" />
            <span className="font-mono font-semibold text-[--clr-accent]">
              {result.efficiencyScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* ─── Upgrade recommendation ───────────────────────────────────── */}
      {isBottlenecked && (
        <div className="card p-4 sm:p-5 border-l-4" style={{ borderLeftColor: `var(${result.color})` }}>
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={16}
              style={{ color: `var(${result.color})` }}
              className="mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">
                Recommended Upgrade: {result.upgradeTarget}
              </p>
              <p className="text-xs text-[--clr-text-secondary] mb-4 leading-relaxed">
                Upgrading your {result.upgradeTarget} will eliminate this bottleneck and
                unlock your build's full potential.
              </p>

              {/* Dynamic Amazon search — no hard-coded links or tags */}
              <AmazonButton
                query={upgradeQuery}
                label={`Shop ${result.upgradeTarget} Upgrades on Amazon`}
                className="text-xs px-3 py-2 w-full sm:w-auto"
              />

              <p className="text-[10px] text-[--clr-text-muted] mt-2">
                * Opens an Amazon search. We may earn a small commission at no cost to you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Technical details toggle ────────────────────────────────── */}
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
              <span className="text-[--clr-text-secondary] text-xs sm:text-sm">{detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* ─── Share ────────────────────────────────────────────────────── */}
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
