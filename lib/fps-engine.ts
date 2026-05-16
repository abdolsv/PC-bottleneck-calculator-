// lib/fps-engine.ts
// Estimates FPS for any CPU + GPU + game + resolution combination.
// Linear model scaled from reference build benchmarks. Good enough for a calculator.

import type { CPU, GPU } from './hardware-data'
import type { Game } from './games-data'

// Reference build used to calibrate baseFps in games-data.ts
const REF_CPU_SCORE = 75
const REF_GPU_SCORE = 75

export type Resolution = '1080p' | '1440p' | '4k'

export interface FpsEstimate {
  fps: number
  fpsRange: { low: number; high: number }  // 1% low and average
  setting: 'Ultra' | 'High' | 'Medium' | 'Low'
  isPlayable: boolean   // >= 30 FPS
  isSmooth: boolean     // >= 60 FPS
  isCompetitive: boolean // >= 144 FPS
  bottleneck: 'CPU' | 'GPU' | 'Balanced'
  cpuFactor: number
  gpuFactor: number
  upgradeGain: {
    betterGpu: string  // e.g. "Upgrading GPU would gain ~25%"
    betterCpu: string
  }
}

export function estimateFps(
  cpu: CPU,
  gpu: GPU,
  game: Game,
  resolution: Resolution,
  ramGb: number = 16
): FpsEstimate {
  // GPU bound increases with resolution
  const gpuBoundAtRes: Record<Resolution, number> = {
    '1080p': game.gpuBound,
    '1440p': Math.min(1, game.gpuBound + 0.08),
    '4k':    Math.min(1, game.gpuBound + 0.15),
  }
  const gpuBound = gpuBoundAtRes[resolution]
  const cpuBound = 1 - gpuBound

  // How much better/worse than the reference build?
  const cpuFactor = cpu.benchmarkScore / REF_CPU_SCORE
  const gpuFactor = gpu.benchmarkScore / REF_GPU_SCORE

  // Blend: GPU-bound games reward GPU upgrades more
  const blendedFactor = Math.pow(gpuFactor, gpuBound) * Math.pow(cpuFactor, cpuBound)

  // RAM penalty: 8GB in modern games costs ~10% FPS
  const ramFactor = ramGb < 16 ? 0.90 : ramGb >= 32 ? 1.02 : 1.0

  const baseFps = game.baseFps[resolution]
  const rawFps = baseFps * blendedFactor * ramFactor

  // Clamp: hardware can't magically give infinite FPS
  const fps = Math.min(rawFps, resolution === '1080p' ? 600 : resolution === '1440p' ? 500 : 400)

  // 1% low estimate (typically 20-30% below average)
  const lowFactor = game.isCompetitive ? 0.78 : 0.72
  const fpsRange = {
    low:  Math.round(fps * lowFactor),
    high: Math.round(fps),
  }

  // Which component is holding back performance?
  const cpuVsGpu = cpuFactor / gpuFactor
  let bottleneck: FpsEstimate['bottleneck']
  if (cpuVsGpu < 0.80) bottleneck = 'CPU'
  else if (cpuVsGpu > 1.25) bottleneck = 'GPU'
  else bottleneck = 'Balanced'

  // Quality setting recommendation based on FPS
  let setting: FpsEstimate['setting']
  if (fps >= 100) setting = 'Ultra'
  else if (fps >= 70) setting = 'High'
  else if (fps >= 45) setting = 'Medium'
  else setting = 'Low'

  // Upgrade gain estimates
  const gpuUpgradeGain = Math.round((gpuBound * 30))    // % gain from ~30% GPU upgrade
  const cpuUpgradeGain = Math.round((cpuBound * 20))    // % gain from ~30% CPU upgrade

  return {
    fps: Math.round(fps),
    fpsRange,
    setting,
    isPlayable: fps >= 30,
    isSmooth: fps >= 60,
    isCompetitive: fps >= 144,
    bottleneck,
    cpuFactor: Math.round(cpuFactor * 100) / 100,
    gpuFactor: Math.round(gpuFactor * 100) / 100,
    upgradeGain: {
      betterGpu: `~${gpuUpgradeGain}% FPS gain from GPU upgrade`,
      betterCpu: `~${cpuUpgradeGain}% FPS gain from CPU upgrade`,
    },
  }
}

// Quick check: can this system run the game?
export function canRunGame(
  cpu: CPU,
  gpu: GPU,
  game: Game,
  ramGb: number
): { tier: 'ultra' | 'recommended' | 'minimum' | 'below-minimum'; message: string } {
  const { minimum, recommended, ultra } = game.requirements

  if (cpu.benchmarkScore >= ultra.cpuScore && gpu.benchmarkScore >= ultra.gpuScore && ramGb >= ultra.ramGb) {
    return { tier: 'ultra', message: 'Your system exceeds Ultra requirements. Max settings.' }
  }
  if (cpu.benchmarkScore >= recommended.cpuScore && gpu.benchmarkScore >= recommended.gpuScore && ramGb >= recommended.ramGb) {
    return { tier: 'recommended', message: 'Your system meets Recommended requirements. High settings.' }
  }
  if (cpu.benchmarkScore >= minimum.cpuScore && gpu.benchmarkScore >= minimum.gpuScore && ramGb >= minimum.ramGb) {
    return { tier: 'minimum', message: 'Your system meets Minimum requirements. Low-medium settings.' }
  }
  return { tier: 'below-minimum', message: 'Your system may struggle to run this game properly.' }
}

// Get best GPU picks for a game at a given resolution
export function getBestGpusForGame(
  game: Game,
  resolution: Resolution,
  targetFps: number,
  allGpus: GPU[]
): GPU[] {
  const refCpu = { benchmarkScore: REF_CPU_SCORE } as CPU
  return allGpus
    .filter(gpu => {
      const est = estimateFps(refCpu, gpu, game, resolution)
      return est.fps >= targetFps * 0.9
    })
    .sort((a, b) => a.benchmarkScore - b.benchmarkScore)
}
