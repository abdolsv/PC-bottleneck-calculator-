// components/calculator/UseCaseSelector.tsx
import { USE_CASES, type UseCase } from '@/lib/hardware-data';
import { Monitor, Video, LayoutGrid, MonitorSpeaker } from 'lucide-react';

const Twitch = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9H9V6h2v5zm4 0h-2V6h2v5z"/>
  </svg>
);

interface UseCaseSelectorProps {
  selected: UseCase
  onChange: (val: UseCase) => void
}

const icons: Record<UseCase, React.ReactNode> = {
  'gaming-1080p':  <Monitor size={14} />,
  'gaming-1440p':  <MonitorSpeaker size={14} />,
  'gaming-4k':     <MonitorSpeaker size={14} />,
  'streaming':     <Twitch size={14} />,
  'video-editing': <Video size={14} />,
  'general':       <LayoutGrid size={14} />,
}

export function UseCaseSelector({ selected, onChange }: UseCaseSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[--clr-text-secondary] uppercase tracking-widest mb-2">
        Use Case
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {(Object.keys(USE_CASES) as UseCase[]).map((key) => {
          const { label } = USE_CASES[key]
          const active = selected === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-[--radius-md] text-xs font-medium
                border transition-all duration-[--transition-fast] text-left
                ${active
                  ? 'bg-[--clr-accent-dim] border-[--clr-accent] text-[--clr-accent]'
                  : 'bg-[--clr-bg-elevated] border-[--clr-border] text-[--clr-text-secondary] hover:border-[--clr-border-glow] hover:text-[--clr-text-primary]'
                }
              `}
            >
              <span className={active ? 'text-[--clr-accent]' : 'text-[--clr-text-muted]'}>
                {icons[key]}
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
