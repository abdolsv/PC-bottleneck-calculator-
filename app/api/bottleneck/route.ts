// app/api/bottleneck/route.ts
// REST API — useful for third-party integrations, or if you sell API access
import { NextRequest, NextResponse } from 'next/server'
import { CPUs, GPUs } from '@/lib/hardware-data'
import { calculateBottleneck } from '@/lib/bottleneck-engine'

// Retained so Next.js actively extracts and handles query parameters at runtime
export const dynamic = 'force-dynamic'

// Note: In-memory Maps clear on cold starts. For bulletproof absolute rate limits 
// across distributed instances, migrate requestCounts to an Upstash Redis adapter.
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit = 30): boolean {
  const now = Date.now()
  const window = 60_000 // 1 minute
  const record = requestCounts.get(ip)

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + window })
    return true
  }
  if (record.count >= limit) return false
  record.count++
  return true
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Max 30 requests/minute.' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const cpuId    = searchParams.get('cpu')
  const gpuId    = searchParams.get('gpu')
  const useCase  = searchParams.get('use') as any ?? 'gaming-1440p'
  const ram      = Number(searchParams.get('ram') ?? 16)

  const cpu = CPUs.find(c => c.id === cpuId)
  const gpu = GPUs.find(g => g.id === gpuId)

  if (!cpu) return NextResponse.json({ error: `CPU '${cpuId}' not found.` }, { status: 404 })
  if (!gpu) return NextResponse.json({ error: `GPU '${gpuId}' not found.` }, { status: 404 })

  const result = calculateBottleneck(cpu, gpu, useCase, ram)

  return NextResponse.json(
    { cpu: cpu.name, gpu: gpu.name, useCase, ram, result },
    {
      headers: {
        // Shared CDN edge layer caches matching queries for up to 1 hour, minimizing CPU impact
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*', 
      },
    }
  )
}

// API docs endpoint
export async function POST() {
  return NextResponse.json({
    message: 'Use GET with ?cpu=CPU_ID&gpu=GPU_ID&use=USE_CASE&ram=RAM_GB',
    example: '/api/bottleneck?cpu=i5-13600k&gpu=rtx-4070&use=gaming-1440p&ram=16',
    availableCpus: CPUs.map(c => c.id),
    availableGpus: GPUs.map(g => g.id),
    availableUseCases: ['gaming-1080p', 'gaming-1440p', 'gaming-4k', 'streaming', 'video-editing', 'general'],
  })
}
