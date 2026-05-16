// lib/custom-hardware.ts
import type { CPU, GPU } from './hardware-data'

const CUSTOM_CPUS_KEY = 'pc-calc-custom-cpus'
const CUSTOM_GPUS_KEY = 'pc-calc-custom-gpus'

// ── CPU ────────────────────────────────────────────────────────────────────
export function saveCustomCPU(cpu: CPU): void {
  if (typeof window === 'undefined') return
  const existing = getCustomCPUs().filter(c => c.id !== cpu.id)
  localStorage.setItem(CUSTOM_CPUS_KEY, JSON.stringify([...existing, cpu]))
}

export function getCustomCPUs(): CPU[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(CUSTOM_CPUS_KEY) ?? '[]') }
  catch { return [] }
}

export function deleteCustomCPU(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CUSTOM_CPUS_KEY, JSON.stringify(getCustomCPUs().filter(c => c.id !== id)))
}

// ── GPU ────────────────────────────────────────────────────────────────────
export function saveCustomGPU(gpu: GPU): void {
  if (typeof window === 'undefined') return
  const existing = getCustomGPUs().filter(g => g.id !== gpu.id)
  localStorage.setItem(CUSTOM_GPUS_KEY, JSON.stringify([...existing, gpu]))
}

export function getCustomGPUs(): GPU[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(CUSTOM_GPUS_KEY) ?? '[]') }
  catch { return [] }
}

export function deleteCustomGPU(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CUSTOM_GPUS_KEY, JSON.stringify(getCustomGPUs().filter(g => g.id !== id)))
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function makeCustomCPUId(name: string): string {
  return `custom-cpu-${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`
}

export function makeCustomGPUID(name: string): string {
  return `custom-gpu-${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`
}
