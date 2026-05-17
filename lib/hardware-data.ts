// lib/hardware-data.ts
export interface CPU {
  id: string
  name: string
  brand: 'Intel' | 'AMD'
  generation: string
  cores: number
  threads: number
  baseClock: number
  boostClock: number
  tdp: number
  tier: 1 | 2 | 3 | 4 | 5
  benchmarkScore: number
  releaseYear: number
  socket: string
}

export interface GPU {
  id: string
  name: string
  brand: 'NVIDIA' | 'AMD' | 'Intel'
  vram: number
  tier: 1 | 2 | 3 | 4 | 5
  benchmarkScore: number
  tdp: number
  releaseYear: number
  targetResolution: '1080p' | '1440p' | '4K' | 'all'
}

import cpusJson from '../data/cpus.json'
import gpusJson from '../data/gpus.json'

export const CPUs: CPU[] = cpusJson.map((c: any) => {
  const isAmd = c.brand?.toUpperCase() === 'AMD'
  const nameLower = (c.name || '').toLowerCase()
  
  // --- INLINE INTELLIGENT SEGMENTATION ENGINE ---
  let calculatedGen = 'Legacy Chips'
  
  if (isAmd) {
    if (nameLower.includes('ryzen 9')) calculatedGen = 'Ryzen 9 Series'
    else if (nameLower.includes('ryzen 7')) calculatedGen = 'Ryzen 7 Series'
    else if (nameLower.includes('ryzen 5')) calculatedGen = 'Ryzen 5 Series'
    else if (nameLower.includes('ryzen 3')) calculatedGen = 'Ryzen 3 Series'
    else if (nameLower.includes('fx-') || nameLower.includes('phenom')) calculatedGen = 'FX & Phenom Legacy'
    else if (nameLower.includes('apu') || nameLower.includes('athlon')) calculatedGen = 'Athlon & APU Series'
  } else {
    // Intel Structural Parsing
    if (nameLower.includes('core i9')) calculatedGen = 'Core i9 High-End'
    else if (nameLower.includes('core i7')) calculatedGen = 'Core i7 Series'
    else if (nameLower.includes('core i5')) calculatedGen = 'Core i5 Series'
    else if (nameLower.includes('core i3')) calculatedGen = 'Core i3 Series'
    else if (nameLower.includes('xeon')) calculatedGen = 'Xeon Workstation'
    else if (nameLower.includes('pentium')) calculatedGen = 'Pentium Desktop'
    else if (nameLower.includes('celeron')) calculatedGen = 'Celeron Budget'
    else if (nameLower.includes('atom')) calculatedGen = 'Atom Embedded'
  }

  return {
    id: c.id,
    name: c.name,
    brand: (isAmd ? 'AMD' : 'Intel') as 'Intel' | 'AMD',
    generation: calculatedGen, // This is no longer hardcoded to 'Unknown'!
    cores: c.cores || 2, 
    threads: c.threads || 2,
    baseClock: c.baseClock || 2.0,
    boostClock: c.boostClock || 2.5,
    tdp: c.tdp || 65,
    tier: c.rank < 20 ? 5 : c.rank < 50 ? 4 : c.rank < 150 ? 3 : c.rank < 300 ? 2 : 1,
    benchmarkScore: c.score,
    releaseYear: c.releaseYear || 2020,
    socket: c.socket || 'Dynamic',
  }
})

export const GPUs: GPU[] = gpusJson.map((g: any) => {
  let mappedBrand: 'NVIDIA' | 'AMD' | 'Intel' = 'NVIDIA'
  const rawBrand = g.brand?.toUpperCase() || ''

  if (rawBrand.includes('AMD')) mappedBrand = 'AMD'
  else if (rawBrand.includes('INTEL')) mappedBrand = 'Intel'
  
  let calculatedTier: 1 | 2 | 3 | 4 | 5 = 1
  if (g.rank < 20) calculatedTier = 5
  else if (g.rank < 50) calculatedTier = 4
  else if (g.rank < 150) calculatedTier = 3
  else if (g.rank < 300) calculatedTier = 2

  return {
    id: g.id,
    name: g.name,
    brand: mappedBrand,
    vram: g.vram || 8,
    tier: calculatedTier,
    benchmarkScore: g.score || 1, 
    tdp: g.tdp || 150,
    releaseYear: g.releaseYear || 2020,
    targetResolution: 'all',
  }
})

export type UseCase = 'gaming-1080p' | 'gaming-1440p' | 'gaming-4k' | 'streaming' | 'video-editing' | 'general'

export const USE_CASES: Record<UseCase, { label: string; cpuWeight: number; gpuWeight: number }> = {
  'gaming-1080p': { label: 'Gaming — 1080p', cpuWeight: 0.45, gpuWeight: 0.55 },
  'gaming-1440p': { label: 'Gaming — 1440p', cpuWeight: 0.35, gpuWeight: 0.65 },
  'gaming-4k': { label: 'Gaming — 4K', cpuWeight: 0.20, gpuWeight: 0.80 },
  'streaming': { label: 'Gaming + Streaming', cpuWeight: 0.60, gpuWeight: 0.40 },
  'video-editing': { label: 'Video Editing', cpuWeight: 0.65, gpuWeight: 0.35 },
  'general': { label: 'General Use', cpuWeight: 0.50, gpuWeight: 0.50 },
}
