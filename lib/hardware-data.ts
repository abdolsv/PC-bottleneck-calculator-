// lib/hardware-data.ts
// This is a curated database. Expand it over time — more entries = more rankable pages.

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

export const CPUs: CPU[] = [
  // ─── Intel 14th Gen ────────────────────────────────────────────────────────
  { id: 'i9-14900k',  name: 'Intel Core i9-14900K',  brand: 'Intel', generation: '14th Gen', cores: 24, threads: 32, baseClock: 3.2, boostClock: 6.0, tdp: 125, tier: 5, benchmarkScore: 97, releaseYear: 2023, socket: 'LGA1700' },
  { id: 'i7-14700k',  name: 'Intel Core i7-14700K',  brand: 'Intel', generation: '14th Gen', cores: 20, threads: 28, baseClock: 3.4, boostClock: 5.6, tdp: 125, tier: 4, benchmarkScore: 90, releaseYear: 2023, socket: 'LGA1700' },
  { id: 'i5-14600k',  name: 'Intel Core i5-14600K',  brand: 'Intel', generation: '14th Gen', cores: 14, threads: 20, baseClock: 3.5, boostClock: 5.3, tdp: 125, tier: 3, benchmarkScore: 80, releaseYear: 2023, socket: 'LGA1700' },
  { id: 'i5-13600k',  name: 'Intel Core i5-13600K',  brand: 'Intel', generation: '13th Gen', cores: 14, threads: 20, baseClock: 3.5, boostClock: 5.1, tdp: 125, tier: 3, benchmarkScore: 77, releaseYear: 2022, socket: 'LGA1700' },
  { id: 'i7-13700k',  name: 'Intel Core i7-13700K',  brand: 'Intel', generation: '13th Gen', cores: 16, threads: 24, baseClock: 3.4, boostClock: 5.4, tdp: 125, tier: 4, benchmarkScore: 87, releaseYear: 2022, socket: 'LGA1700' },
  { id: 'i5-12600k',  name: 'Intel Core i5-12600K',  brand: 'Intel', generation: '12th Gen', cores: 10, threads: 16, baseClock: 3.7, boostClock: 4.9, tdp: 125, tier: 3, benchmarkScore: 70, releaseYear: 2021, socket: 'LGA1700' },
  { id: 'i3-12100f',  name: 'Intel Core i3-12100F',  brand: 'Intel', generation: '12th Gen', cores: 4,  threads: 8,  baseClock: 3.3, boostClock: 4.3, tdp: 58,  tier: 1, benchmarkScore: 45, releaseYear: 2022, socket: 'LGA1700' },
  // ─── AMD Ryzen 7000 ────────────────────────────────────────────────────────
  { id: 'r9-7950x',   name: 'AMD Ryzen 9 7950X',     brand: 'AMD',   generation: 'Ryzen 7000', cores: 16, threads: 32, baseClock: 4.5, boostClock: 5.7, tdp: 170, tier: 5, benchmarkScore: 99, releaseYear: 2022, socket: 'AM5' },
  { id: 'r9-7900x',   name: 'AMD Ryzen 9 7900X',     brand: 'AMD',   generation: 'Ryzen 7000', cores: 12, threads: 24, baseClock: 4.7, boostClock: 5.6, tdp: 170, tier: 5, benchmarkScore: 92, releaseYear: 2022, socket: 'AM5' },
  { id: 'r7-7700x',   name: 'AMD Ryzen 7 7700X',     brand: 'AMD',   generation: 'Ryzen 7000', cores: 8,  threads: 16, baseClock: 4.5, boostClock: 5.4, tdp: 105, tier: 3, benchmarkScore: 83, releaseYear: 2022, socket: 'AM5' },
  { id: 'r5-7600x',   name: 'AMD Ryzen 5 7600X',     brand: 'AMD',   generation: 'Ryzen 7000', cores: 6,  threads: 12, baseClock: 4.7, boostClock: 5.3, tdp: 105, tier: 3, benchmarkScore: 76, releaseYear: 2022, socket: 'AM5' },
  { id: 'r5-7600',    name: 'AMD Ryzen 5 7600',      brand: 'AMD',   generation: 'Ryzen 7000', cores: 6,  threads: 12, baseClock: 3.8, boostClock: 5.1, tdp: 65,  tier: 2, benchmarkScore: 72, releaseYear: 2023, socket: 'AM5' },
  { id: 'r5-5600x',   name: 'AMD Ryzen 5 5600X',     brand: 'AMD',   generation: 'Ryzen 5000', cores: 6,  threads: 12, baseClock: 3.7, boostClock: 4.6, tdp: 65,  tier: 2, benchmarkScore: 65, releaseYear: 2020, socket: 'AM4' },
  { id: 'r7-5800x3d', name: 'AMD Ryzen 7 5800X3D',   brand: 'AMD',   generation: 'Ryzen 5000', cores: 8,  threads: 16, baseClock: 3.4, boostClock: 4.5, tdp: 105, tier: 4, benchmarkScore: 95, releaseYear: 2022, socket: 'AM4' },
]

export const GPUs: GPU[] = [
  // ─── NVIDIA RTX 40 Series ──────────────────────────────────────────────────
  { id: 'rtx-4090',   name: 'NVIDIA RTX 4090',   brand: 'NVIDIA', vram: 24, tier: 5, benchmarkScore: 100, tdp: 450, releaseYear: 2022, targetResolution: '4K' },
  { id: 'rtx-4080s',  name: 'NVIDIA RTX 4080 Super', brand: 'NVIDIA', vram: 16, tier: 5, benchmarkScore: 88, tdp: 320, releaseYear: 2024, targetResolution: '4K' },
  { id: 'rtx-4080',   name: 'NVIDIA RTX 4080',   brand: 'NVIDIA', vram: 16, tier: 5, benchmarkScore: 85, tdp: 320, releaseYear: 2022, targetResolution: '4K' },
  { id: 'rtx-4070ti', name: 'NVIDIA RTX 4070 Ti Super', brand: 'NVIDIA', vram: 16, tier: 4, benchmarkScore: 79, tdp: 285, releaseYear: 2024, targetResolution: '1440p' },
  { id: 'rtx-4070',   name: 'NVIDIA RTX 4070 Super', brand: 'NVIDIA', vram: 12, tier: 4, benchmarkScore: 72, tdp: 220, releaseYear: 2024, targetResolution: '1440p' },
  { id: 'rtx-4060ti', name: 'NVIDIA RTX 4060 Ti',  brand: 'NVIDIA', vram: 16, tier: 3, benchmarkScore: 60, tdp: 165, releaseYear: 2023, targetResolution: '1440p' },
  { id: 'rtx-4060',   name: 'NVIDIA RTX 4060',   brand: 'NVIDIA', vram: 8,  tier: 2, benchmarkScore: 50, tdp: 115, releaseYear: 2023, targetResolution: '1080p' },
  { id: 'rtx-3080',   name: 'NVIDIA RTX 3080',   brand: 'NVIDIA', vram: 10, tier: 4, benchmarkScore: 75, tdp: 320, releaseYear: 2020, targetResolution: '4K' },
  { id: 'rtx-3070',   name: 'NVIDIA RTX 3070',   brand: 'NVIDIA', vram: 8,  tier: 3, benchmarkScore: 64, tdp: 220, releaseYear: 2020, targetResolution: '1440p' },
  { id: 'rtx-3060',   name: 'NVIDIA RTX 3060',   brand: 'NVIDIA', vram: 12, tier: 2, benchmarkScore: 48, tdp: 170, releaseYear: 2021, targetResolution: '1080p' },
  // ─── AMD RX 7000 Series ────────────────────────────────────────────────────
  { id: 'rx-7900xtx', name: 'AMD RX 7900 XTX',   brand: 'AMD',    vram: 24, tier: 5, benchmarkScore: 92, tdp: 355, releaseYear: 2022, targetResolution: '4K' },
  { id: 'rx-7900xt',  name: 'AMD RX 7900 XT',    brand: 'AMD',    vram: 20, tier: 5, benchmarkScore: 84, tdp: 315, releaseYear: 2022, targetResolution: '4K' },
  { id: 'rx-7800xt',  name: 'AMD RX 7800 XT',    brand: 'AMD',    vram: 16, tier: 3, benchmarkScore: 66, tdp: 263, releaseYear: 2023, targetResolution: '1440p' },
  { id: 'rx-7600',    name: 'AMD RX 7600',        brand: 'AMD',    vram: 8,  tier: 2, benchmarkScore: 47, tdp: 165, releaseYear: 2023, targetResolution: '1080p' },
]

export type UseCase = 'gaming-1080p' | 'gaming-1440p' | 'gaming-4k' | 'streaming' | 'video-editing' | 'general'

export const USE_CASES: Record<UseCase, { label: string; cpuWeight: number; gpuWeight: number }> = {
  'gaming-1080p':    { label: 'Gaming — 1080p',         cpuWeight: 0.45, gpuWeight: 0.55 },
  'gaming-1440p':    { label: 'Gaming — 1440p',         cpuWeight: 0.35, gpuWeight: 0.65 },
  'gaming-4k':       { label: 'Gaming — 4K',            cpuWeight: 0.20, gpuWeight: 0.80 },
  'streaming':       { label: 'Gaming + Streaming',     cpuWeight: 0.60, gpuWeight: 0.40 },
  'video-editing':   { label: 'Video Editing',          cpuWeight: 0.65, gpuWeight: 0.35 },
  'general':         { label: 'General Use',            cpuWeight: 0.50, gpuWeight: 0.50 },
}
