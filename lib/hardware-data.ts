export interface CPU {
  id: string
  name: string
  brand: 'Intel' | 'AMD'
  generation: string
  cores: number
  threads: number
  baseClock: number    // GHz
  boostClock: number   // GHz
  tdp: number          // Watts
  tier: 1 | 2 | 3 | 4 | 5  // 5 = flagship, 1 = budget
  benchmarkScore: number    // Normalized 0–100 (relative to current gen)
  releaseYear: number
  socket: string
}

export interface GPU {
  id: string
  name: string
  brand: 'NVIDIA' | 'AMD' | 'Intel'
  vram: number         // GB
  tier: 1 | 2 | 3 | 4 | 5
  benchmarkScore: number  // 0–100 normalized
  tdp: number
  releaseYear: number
  targetResolution: '1080p' | '1440p' | '4K' | 'all'
}

import cpusJson from '../data/cpus.json'
import gpusJson from '../data/gpus.json'

export const CPUs: CPU[] = cpusJson.map((c: any) => ({
  id: c.id,
  name: c.name,
  brand: c.brand as 'Intel' | 'AMD',
  generation: 'Unknown',
  cores: 0,
  threads: 0,
  baseClock: 0,
  boostClock: 0,
  tdp: 0,
  tier: c.rank < 20 ? 5 : c.rank < 50 ? 4 : c.rank < 150 ? 3 : c.rank < 300 ? 2 : 1,
  benchmarkScore: c.score,
  releaseYear: 2020,
  socket: 'Unknown',
}))

export const GPUs: GPU[] = gpusJson.map((g: any) => ({
  id: g.id,
  name: g.name,
  brand: g.brand as 'NVIDIA' | 'AMD' | 'Intel',
  vram: 8,
  tier: g.rank < 20 ? 5 : g.rank < 50 ? 4 : g.rank < 150 ? 3 : g.rank < 300 ? 2 : 1,
  benchmarkScore: g.score,
  tdp: 0,
  releaseYear: 2020,
  targetResolution: 'all',
}))

export type UseCase = 'gaming-1080p' | 'gaming-1440p' | 'gaming-4k' | 'streaming' | 'video-editing' | 'general'

export const USE_CASES: Record<UseCase, { label: string; cpuWeight: number; gpuWeight: number }> = {
  'gaming-1080p': { label: 'Gaming — 1080p', cpuWeight: 0.45, gpuWeight: 0.55 },
  'gaming-1440p': { label: 'Gaming — 1440p', cpuWeight: 0.35, gpuWeight: 0.65 },
  'gaming-4k': { label: 'Gaming — 4K', cpuWeight: 0.20, gpuWeight: 0.80 },
  'streaming': { label: 'Gaming + Streaming', cpuWeight: 0.60, gpuWeight: 0.40 },
  'video-editing': { label: 'Video Editing', cpuWeight: 0.65, gpuWeight: 0.35 },
  'general': { label: 'General Use', cpuWeight: 0.50, gpuWeight: 0.50 },
}
