// lib/bottleneck-engine.ts
import type { CPU, GPU, UseCase } from './hardware-data'
import { USE_CASES } from './hardware-data'

export interface BottleneckResult {
  percentage: number          // 0–100 (how bottlenecked)
  bottlenecker: 'CPU' | 'GPU' | 'Balanced'
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical'
  label: string               // Human-readable label
  color: string               // CSS variable name
  recommendation: string      // What to do
  upgradeTarget: string       // Which component to upgrade first
  efficiencyScore: number     // How well matched 0–100
  cpuUtilization: number      // Estimated CPU usage %
  gpuUtilization: number      // Estimated GPU usage %
  details: string[]           // Bullet point details
}

export function calculateBottleneck(
  cpu: CPU,
  gpu: GPU,
  useCase: UseCase,
  ramGb: number = 16
): BottleneckResult {
  const weights = USE_CASES[useCase]

  // Normalize scores relative to each other
  const cpuScore = cpu.benchmarkScore
  const gpuScore = gpu.benchmarkScore

  // Weighted performance requirement
  const cpuDemand = gpuScore * weights.cpuWeight
  const gpuDemand = cpuScore * weights.gpuWeight

  // Raw bottleneck: how much one component limits the other
  const cpuBottleneckRaw = Math.max(0, gpuScore - cpuScore) / Math.max(gpuScore, 1)
  const gpuBottleneckRaw = Math.max(0, cpuScore - gpuScore) / Math.max(cpuScore, 1)

  // Weighted bottleneck percentage
  const cpuBottleneckPct = Math.min(100, Math.round(cpuBottleneckRaw * 100 * weights.cpuWeight * 2))
  const gpuBottleneckPct = Math.min(100, Math.round(gpuBottleneckRaw * 100 * weights.gpuWeight * 2))

  const bottleneckPct = Math.max(cpuBottleneckPct, gpuBottleneckPct)
  const isCpuBottleneck = cpuBottleneckPct >= gpuBottleneckPct

  // Estimate utilization
  const scoreDelta = cpuScore - gpuScore
  let cpuUtil: number, gpuUtil: number
  if (scoreDelta > 0) {
    // CPU is stronger — GPU is the limiter, runs near 100%, CPU has headroom
    gpuUtil = Math.min(98, 85 + (scoreDelta / 100) * 10)
    cpuUtil = Math.max(40, gpuUtil - (scoreDelta / 100) * 30)
  } else if (scoreDelta < 0) {
    // GPU is stronger — CPU is the limiter
    cpuUtil = Math.min(98, 85 + (Math.abs(scoreDelta) / 100) * 10)
    gpuUtil = Math.max(40, cpuUtil - (Math.abs(scoreDelta) / 100) * 30)
  } else {
    cpuUtil = 85; gpuUtil = 85
  }

  // RAM adjustment (8GB penalty in games)
  const ramPenalty = ramGb < 16 && useCase.startsWith('gaming') ? 5 : 0

  const finalPct = Math.min(100, bottleneckPct + ramPenalty)

  // Severity thresholds
  let severity: BottleneckResult['severity']
  let label: string
  let color: string
  if (finalPct <= 5)       { severity = 'none';     label = 'No Bottleneck';       color = '--clr-ok' }
  else if (finalPct <= 20) { severity = 'low';      label = 'Minor Bottleneck';    color = '--clr-low' }
  else if (finalPct <= 40) { severity = 'medium';   label = 'Moderate Bottleneck'; color = '--clr-medium' }
  else if (finalPct <= 60) { severity = 'high';     label = 'Significant Bottleneck'; color = '--clr-high' }
  else                     { severity = 'critical'; label = 'Severe Bottleneck';   color = '--clr-critical' }

  const bottlenecker: BottleneckResult['bottlenecker'] =
    finalPct <= 5 ? 'Balanced' : isCpuBottleneck ? 'CPU' : 'GPU'

  // Recommendations
  const recommendations: Record<string, string> = {
    none:     'Great match! Your CPU and GPU are well balanced. Focus on RAM speed and storage.',
    low:      `Minor inefficiency. You\'ll see less than ${finalPct}% performance loss. Acceptable for most builds.`,
    medium:   `${bottlenecker} is holding back your ${bottlenecker === 'CPU' ? 'GPU' : 'CPU'}. Consider upgrading your ${bottlenecker} next.`,
    high:     `Significant mismatch. Your ${bottlenecker} is leaving considerable performance on the table.`,
    critical: `Severe bottleneck. Your ${bottlenecker} is a major limiter. Upgrade it before anything else.`,
  }

  // Efficiency score (100 = perfect balance)
  const efficiencyScore = Math.max(0, 100 - finalPct)

  // Details bullets
  const details: string[] = [
    `${cpu.name} benchmark score: ${cpuScore}/100`,
    `${gpu.name} benchmark score: ${gpuScore}/100`,
    `Estimated CPU utilization: ~${Math.round(cpuUtil)}%`,
    `Estimated GPU utilization: ~${Math.round(gpuUtil)}%`,
    `Use case weighting: CPU ${Math.round(weights.cpuWeight * 100)}% / GPU ${Math.round(weights.gpuWeight * 100)}%`,
    ramGb < 16 ? `⚠ ${ramGb}GB RAM may limit performance in modern games` : `${ramGb}GB RAM is sufficient`,
  ]

  return {
    percentage: finalPct,
    bottlenecker,
    severity,
    label,
    color,
    recommendation: recommendations[severity],
    upgradeTarget: bottlenecker === 'Balanced' ? 'Neither — great build!' : bottlenecker,
    efficiencyScore,
    cpuUtilization: Math.round(cpuUtil),
    gpuUtilization: Math.round(gpuUtil),
    details,
  }
}

// Utility: get color hex from severity (for charts)
export function getSeverityHex(severity: BottleneckResult['severity']): string {
  const map: Record<string, string> = {
    none:     '#00d4ff',
    low:      '#22d3a0',
    medium:   '#f5a524',
    high:     '#ef4444',
    critical: '#ff2056',
  }
  return map[severity] ?? '#8b90a4'
}
