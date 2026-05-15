// lib/fps-estimator.ts
export interface FpsEstimate {
  game: string
  resolution: string
  estimatedFps: string // "85–105 FPS"
  limitedBy: 'CPU' | 'GPU' | 'Balanced'
}

// Base FPS data (maintain and expand this)
const BASE_FPS_DATA: Record<string, Record<string, number>> = {
  'Cyberpunk 2077': {
    '1080p-rtx-4090': 140, '1440p-rtx-4090': 110, '4K-rtx-4090': 75,
    '1080p-rtx-4070': 95,  '1440p-rtx-4070': 72,  '4K-rtx-4070': 45,
    // ... expand per GPU
  },
}
