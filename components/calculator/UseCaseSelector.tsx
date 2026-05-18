'use client'

import { USE_CASES, type UseCase } from '@/lib/hardware-data'
import { Monitor, Video, LayoutGrid, MonitorSpeaker } from 'lucide-react'

const StreamIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9H9V6h2v5zm4 0h-2V6h2v5z" />
  </svg>
)

interface UseCaseSelectorProps {
  selected: UseCase
  onChange: (val: UseCase) => void
}

const USE_CASE_META: Record<UseCase, { icon: React.ReactNode; description: string }> = {
  'gaming-1080p':  { icon: <Monitor size={14} aria-hidden />,       description: 'CPU-heavy; prioritises single-thread speed' },
  'gaming-1440p':  { icon: <MonitorSpeaker size={14} aria-hidden />, description: 'Balanced GPU/CPU sweet-spot' },
  'gaming-4k':     { icon: <MonitorSpeaker size={14} aria-hidden />, description: 'GPU-dominant; CPU is rarely the limiter' },
  'streaming':     { icon: <StreamIcon />,                           description: 'Extra CPU load for encoder threads' },
  'video-editing': { icon: <Video size={14} aria-hidden />,          description: 'Multi-core + GPU compute workload' },
  'general':       { icon: <LayoutGrid size={14} aria-hidden />,     description: 'Mixed everyday tasks' },
}

export function UseCaseSelector({ selected, onChange }: UseCaseSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-widest mb-2"
             style={{ color: 'var(--clr-text-secondary)' }}>
        Use Case
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 [transform:translateZ(0)] backface-hidden">
        {(Object.keys(USE_CASES) as UseCase[]).map((key) => {
          const active = selected === key
          const { label } = USE_CASES[key]
          const { icon, description } = USE_CASE_META[key]

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={description}
              aria-pressed={active}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff] transform-gpu transition-[background-color,border-color,color]"
              style={{
                backgroundColor: active ? 'rgba(0,212,255,0.12)' : 'var(--clr-bg-elevated)',
                borderColor:     active ? 'rgba(0,212,255,0.65)' : 'var(--clr-border)',
                color:           active ? '#00d4ff'               : 'var(--clr-text-secondary)',
                boxShadow:       active ? '0 0 0 1px rgba(0,212,255,0.18) inset' : 'none',
              }}
            >
              <span
                className="flex-shrink-0"
                style={{ color: active ? '#00d4ff' : 'var(--clr-text-muted)' }}
              >
                {icon}
              </span>

              <span className="leading-tight">{label}</span>

              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: '#00d4ff' }}
                />
              )}
            </button>
          )
        })}
      </div>

      <p className="mt-1.5 text-[10px] leading-relaxed" style={{ color: 'var(--clr-text-muted)' }}>
        {USE_CASE_META[selected].description}
      </p>
    </div>
  )
}
