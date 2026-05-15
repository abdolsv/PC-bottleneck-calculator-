// lib/build-storage.ts
export interface SavedBuild {
  id: string
  name: string
  cpuId: string
  gpuId: string
  useCase: string
  ram: number
  result: {
    percentage: number
    label: string
    severity: string
  }
  savedAt: string
}

export function saveBuild(build: Omit<SavedBuild, 'id' | 'savedAt'>): SavedBuild {
  const saved: SavedBuild = {
    ...build,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  }
  const existing = getSavedBuilds()
  const updated = [saved, ...existing].slice(0, 10) // max 10 saved builds
  localStorage.setItem('pc-builds', JSON.stringify(updated))
  return saved
}

export function getSavedBuilds(): SavedBuild[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('pc-builds') ?? '[]')
  } catch {
    return []
  }
}

export function deleteBuild(id: string): void {
  const updated = getSavedBuilds().filter(b => b.id !== id)
  localStorage.setItem('pc-builds', JSON.stringify(updated))
}
