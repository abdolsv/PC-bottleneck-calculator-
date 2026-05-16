// app/og/route.tsx
// Generates OG images on-demand using Vercel's @vercel/og
// Usage: /og?title=RTX+4090+Bottleneck&pct=12&severity=low

import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title    = searchParams.get('title') ?? 'PC Bottleneck Calculator'
  const pct      = searchParams.get('pct')
  const severity = searchParams.get('severity') ?? 'none'
  const cpu      = searchParams.get('cpu') ?? ''
  const gpu      = searchParams.get('gpu') ?? ''

  const colorMap: Record<string, string> = {
    none:     '#00d4ff',
    low:      '#22d3a0',
    medium:   '#f5a524',
    high:     '#ef4444',
    critical: '#ff2056',
  }
  const accentColor = colorMap[severity] ?? '#00d4ff'

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0b0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(42,45,56,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(42,45,56,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Glow blob */}
        {pct && (
          <div style={{
            position: 'absolute', top: -100, right: -100,
            width: 400, height: 400,
            borderRadius: '50%',
            background: accentColor,
            opacity: 0.06,
            filter: 'blur(80px)',
          }} />
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `rgba(${accentColor === '#00d4ff' ? '0,212,255' : '255,255,255'},0.1)`,
            border: `1px solid ${accentColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: accentColor, fontSize: 18 }}>⬡</span>
          </div>
          <span style={{ color: '#f0f2f8', fontSize: 20, fontWeight: 700 }}>
            PC<span style={{ color: accentColor }}>Bottleneck</span>.com
          </span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{
            color: '#f0f2f8', fontSize: 48, fontWeight: 800,
            lineHeight: 1.1, margin: '0 0 20px',
            maxWidth: pct ? '65%' : '80%',
          }}>
            {title}
          </h1>

          {cpu && gpu && (
            <p style={{ color: '#8b90a4', fontSize: 22, margin: '0 0 30px' }}>
              {cpu} + {gpu}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{
              background: `${accentColor}20`, border: `1px solid ${accentColor}40`,
              color: accentColor, padding: '6px 16px', borderRadius: 100,
              fontSize: 16, fontWeight: 600,
            }}>
              Free · No Signup · Instant Results
            </span>
          </div>
        </div>

        {/* Big percentage */}
        {pct && (
          <div style={{
            position: 'absolute', right: 60, top: '50%',
            transform: 'translateY(-50%)',
            textAlign: 'right',
          }}>
            <p style={{
              color: accentColor, fontSize: 120, fontWeight: 900,
              lineHeight: 1, margin: 0,
              textShadow: `0 0 60px ${accentColor}40`,
            }}>
              {pct}%
            </p>
            <p style={{ color: '#4e5266', fontSize: 18, margin: '8px 0 0' }}>bottleneck</p>
          </div>
        )}

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#4e5266', fontSize: 16, margin: 0 }}>
            pcbottleneck.com
          </p>
          <p style={{ color: '#4e5266', fontSize: 16, margin: 0 }}>
            Free CPU & GPU Analysis Tool
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
