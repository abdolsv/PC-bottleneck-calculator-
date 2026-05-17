// lib/bottleneck-engine.ts
import type { CPU, GPU, UseCase } from './hardware-data'
import { USE_CASES } from './hardware-data'

export type RamSpeed = 'ddr4-3200' | 'ddr4-3600' | 'ddr5-5600' | 'ddr5-6000'

export interface BottleneckResult {
  percentage:      number                                   // 0–100
  bottlenecker:    'CPU' | 'GPU' | 'Balanced'
  severity:        'none' | 'low' | 'medium' | 'high' | 'critical'
  label:           string
  color:           string                                   // CSS variable name
  recommendation:  string
  upgradeTarget:   string
  efficiencyScore: number                                   // 0–100 inverse of bottleneck
  cpuUtilization:  number                                   // Estimated %
  gpuUtilization:  number                                   // Estimated %
  details:         string[]
}

// ─── Constants ──────────────────────────────────────────────────────────────

/**
 * Raw CPU score boost from RAM speed before use-case weighting.
 * Real-world latency improvements from faster RAM primarily help the CPU feed
 * the GPU with draw calls — not GPU pixel throughput.
 */
const RAM_SPEED_BASE_BOOST: Record<RamSpeed, number> = {
  'ddr4-3200': 0.000,  // baseline
  'ddr4-3600': 0.018,  // ~1.8% faster L3 cache / memory bandwidth
  'ddr5-5600': 0.035,  // ~3.5% boost (lower latency, dual-channel)
  'ddr5-6000': 0.050,  // ~5.0% (peak sweet-spot for DDR5)
}

const RAM_SPEED_LABEL: Record<RamSpeed, string> = {
  'ddr4-3200': 'DDR4-3200',
  'ddr4-3600': 'DDR4-3600',
  'ddr5-5600': 'DDR5-5600',
  'ddr5-6000': 'DDR5-6000',
}

// ─── Main function ───────────────────────────────────────────────────────────

export function calculateBottleneck(
  cpu:      CPU,
  gpu:      GPU,
  useCase:  UseCase,
  ramGb:    number   = 16,
  ramSpeed: RamSpeed = 'ddr4-3200',
): BottleneckResult {
  const weights = USE_CASES[useCase]

  // ── Step 1: Effective scores ───────────────────────────────────────────────
  //
  // RAM SPEED → CPU boost, use-case weighted.
  // Faster RAM benefits the CPU in proportion to how CPU-bound the scenario is.
  //   General / streaming (cpuWeight ≈ 0.50–0.60): full boost
  //   1080p gaming         (cpuWeight = 0.45):      90% of boost
  //   4K gaming            (cpuWeight = 0.20):      40% of boost
  //
  // Normalised against 0.50 so "general" is the 1× baseline.
  const ramEffectiveness  = weights.cpuWeight / 0.50
  const ramBoostApplied   = RAM_SPEED_BASE_BOOST[ramSpeed] * ramEffectiveness
  const effectiveCpuScore = Math.min(100, cpu.benchmarkScore * (1 + ramBoostApplied))

  // VRAM adequacy — low-VRAM cards exceed their bandwidth at high resolution
  // regardless of raw compute score, so we penalise the effective GPU score.
  const vramFactor =
    gpu.vram <= 4 && useCase === 'gaming-4k'    ? 0.78 :
    gpu.vram <= 6 && useCase === 'gaming-4k'    ? 0.91 :
    gpu.vram <= 4 && useCase === 'gaming-1440p' ? 0.90 :
    gpu.vram <= 6 && useCase === 'gaming-1440p' ? 0.96 :
    gpu.vram <= 4 && useCase === 'gaming-1080p' ? 0.94 :
    1.00
  const effectiveGpuScore = Math.min(100, gpu.benchmarkScore * vramFactor)

  // ── Step 2: Raw mismatch ratios ────────────────────────────────────────────
  //
  // cpuBottleneckRaw: fraction of GPU potential the CPU cannot service
  //   — applies when GPU score > CPU score (GPU sitting idle)
  // gpuBottleneckRaw: fraction of CPU potential the GPU cannot render
  //   — applies when CPU score > GPU score (CPU sitting idle)
  const cpuBottleneckRaw = Math.max(0, effectiveGpuScore - effectiveCpuScore)
                           / Math.max(effectiveGpuScore, 1)
  const gpuBottleneckRaw = Math.max(0, effectiveCpuScore - effectiveGpuScore)
                           / Math.max(effectiveCpuScore, 1)

  // ── Step 3: Weighted & dampened bottleneck percentages ─────────────────────
  //
  // Multiply by (weight × 1.6) to bring ratios into a realistic 0–80% range
  // (rather than clamping everything at 100% with ×2).
  //
  // CPU BOTTLENECK DAMPENING at high resolution:
  // At 4K the GPU is compute-saturated with 8× more pixels than 1080p.
  // Empirical CPU-swap tests (DF, Hardware Unboxed) consistently show
  // <5–8% fps delta between an i3 and i9 at 4K on the same GPU.
  // We model this by dampening CPU bottleneck impact by resolution.
  const cpuDampening =
    useCase === 'gaming-4k'    ? 0.38 :
    useCase === 'gaming-1440p' ? 0.72 :
    1.00

  const cpuBottleneckPct = Math.min(100, Math.round(
    cpuBottleneckRaw * 100 * weights.cpuWeight * 1.6 * cpuDampening
  ))
  const gpuBottleneckPct = Math.min(100, Math.round(
    gpuBottleneckRaw * 100 * weights.gpuWeight * 1.6
  ))

  const isCpuBottleneck = cpuBottleneckPct >= gpuBottleneckPct
  const bottleneckPct   = Math.max(cpuBottleneckPct, gpuBottleneckPct)

  // ── Step 4: RAM size penalty ───────────────────────────────────────────────
  //
  // Handled SEPARATELY from the score-based mismatch above.
  // These represent real-world overhead that isn't captured in benchmark scores:
  //  • 8 GB causes OS+game memory contention → stutters in modern titles
  //  • Video editing with < 32 GB causes timeline paging
  const ramPenalty: number =
    ramGb < 16 && useCase === 'video-editing'  ? 15 :
    ramGb < 16 && useCase === 'streaming'      ? 8  :
    ramGb < 16 && useCase.startsWith('gaming') ? 8  :
    ramGb < 16                                 ? 4  :
    ramGb < 32 && useCase === 'video-editing'  ? 5  :
    0

  const finalPct = Math.min(100, bottleneckPct + ramPenalty)

  // ── Step 5: Utilization estimates ─────────────────────────────────────────
  //
  // GPU BASE UTILIZATION by resolution/use-case:
  // At 4K the GPU is always compute-saturated (pushing ~8M pixels/frame).
  // At 1080p with matched hardware, GPU sits around 82%.
  //
  // Bottlenecking component runs near 100%; the other has proportional headroom.
  const gpuBaseUtil =
    useCase === 'gaming-4k'     ? 93 :
    useCase === 'gaming-1440p'  ? 88 :
    useCase === 'video-editing' ? 78 :
    useCase === 'streaming'     ? 76 :
    82

  let cpuUtil: number
  let gpuUtil: number

  if (finalPct <= 5) {
    // Balanced — both components working efficiently
    cpuUtil = 84
    gpuUtil = gpuBaseUtil
  } else if (isCpuBottleneck) {
    // CPU saturated, GPU has headroom waiting for draw calls
    cpuUtil = Math.round(Math.min(99, 88 + finalPct * 0.10))
    gpuUtil = Math.round(Math.max(40, gpuBaseUtil - finalPct * 0.45))
  } else {
    // GPU saturated, CPU has headroom waiting for frame completion
    gpuUtil = Math.round(Math.min(99, gpuBaseUtil + (99 - gpuBaseUtil) * (finalPct / 100) * 0.8))
    cpuUtil = Math.round(Math.max(35, 85 - finalPct * 0.48))
  }

  // ── Step 6: Severity, labels, colors ──────────────────────────────────────
  let severity: BottleneckResult['severity']
  let label:    string
  let color:    string

  if      (finalPct <= 5)  { severity = 'none';     label = 'No Bottleneck';          color = '--clr-ok'       }
  else if (finalPct <= 20) { severity = 'low';      label = 'Minor Bottleneck';       color = '--clr-low'      }
  else if (finalPct <= 40) { severity = 'medium';   label = 'Moderate Bottleneck';    color = '--clr-medium'   }
  else if (finalPct <= 60) { severity = 'high';     label = 'Significant Bottleneck'; color = '--clr-high'     }
  else                     { severity = 'critical'; label = 'Severe Bottleneck';      color = '--clr-critical' }

  const bottlenecker: BottleneckResult['bottlenecker'] =
    finalPct <= 5 ? 'Balanced' : isCpuBottleneck ? 'CPU' : 'GPU'

  // ── Step 7: Recommendations ────────────────────────────────────────────────
  const otherComponent = bottlenecker === 'CPU' ? 'GPU' : 'CPU'
  const recommendations: Record<BottleneckResult['severity'], string> = {
    none:     'Great pairing — your CPU and GPU are well balanced. Faster RAM or NVMe storage will be your next meaningful upgrade.',
    low:      `Minor mismatch — under ${finalPct}% real-world performance loss. Acceptable for most builds; no urgent action needed.`,
    medium:   `Your ${bottlenecker} is holding back your ${otherComponent}. Consider upgrading your ${bottlenecker} next.`,
    high:     `Significant mismatch — your ${bottlenecker} is leaving meaningful ${otherComponent} performance unused. Prioritise upgrading it.`,
    critical: `Severe bottleneck — your ${bottlenecker} is a critical limiter. Upgrade it before anything else.`,
  }

  // ── Step 8: Detail bullets ─────────────────────────────────────────────────
  const cpuScoreDisplay = effectiveCpuScore !== cpu.benchmarkScore
    ? `${cpu.benchmarkScore}/100 → ${Math.round(effectiveCpuScore)}/100 effective (RAM speed)`
    : `${cpu.benchmarkScore}/100`
  const gpuScoreDisplay = effectiveGpuScore !== gpu.benchmarkScore
    ? `${gpu.benchmarkScore}/100 → ${Math.round(effectiveGpuScore)}/100 effective (VRAM constraint)`
    : `${gpu.benchmarkScore}/100`

  const ramSpeedLine = ramSpeed !== 'ddr4-3200'
    ? `${RAM_SPEED_LABEL[ramSpeed]}: +${(ramBoostApplied * 100).toFixed(1)}% effective CPU boost for this use case`
    : `${RAM_SPEED_LABEL[ramSpeed]}: baseline — no additional CPU boost`

  const ramSizeLine =
    ramGb < 16
      ? `⚠ ${ramGb}GB RAM is below the 16GB minimum — expect stuttering in modern titles`
      : ramGb < 32 && useCase === 'video-editing'
      ? `⚠ ${ramGb}GB RAM may cause paging in video editing — 32GB+ recommended`
      : `${ramGb}GB RAM — sufficient for this use case`

  const details: string[] = [
    `CPU benchmark score: ${cpuScoreDisplay}`,
    `GPU benchmark score: ${gpuScoreDisplay}`,
    `Estimated CPU utilization: ~${cpuUtil}%`,
    `Estimated GPU utilization: ~${gpuUtil}%`,
    `Use case weighting: CPU ${Math.round(weights.cpuWeight * 100)}% / GPU ${Math.round(weights.gpuWeight * 100)}%`,
    ramSpeedLine,
    ramSizeLine,
  ]

  return {
    percentage:      finalPct,
    bottlenecker,
    severity,
    label,
    color,
    recommendation:  recommendations[severity],
    upgradeTarget:   bottlenecker === 'Balanced' ? 'Neither — great build!' : bottlenecker,
    efficiencyScore: Math.max(0, 100 - finalPct),
    cpuUtilization:  cpuUtil,
    gpuUtilization:  gpuUtil,
    details,
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Returns a concrete hex colour for a severity level (for charts, etc.). */
export function getSeverityHex(severity: BottleneckResult['severity']): string {
  const map: Record<BottleneckResult['severity'], string> = {
    none:     '#00d4ff',
    low:      '#22d3a0',
    medium:   '#f5a524',
    high:     '#ef4444',
    critical: '#ff2056',
  }
  return map[severity]
}
