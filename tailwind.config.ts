// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
      },
      colors: {
        brand: {
          bg:          'var(--clr-bg)',
          card:        'var(--clr-bg-card)',
          elevated:    'var(--clr-bg-elevated)',
          border:      'var(--clr-border)',
          accent:      'var(--clr-accent)',
          ok:          'var(--clr-ok)',
          low:         'var(--clr-low)',
          medium:      'var(--clr-medium)',
          high:        'var(--clr-high)',
          critical:    'var(--clr-critical)',
        },
      },
      animation: {
        'in': 'enter 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in-from-right-4': 'slideInFromRight 0.3s ease-out',
        'slide-in-from-bottom-4': 'slideInFromBottom 0.4s ease-out',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromBottom: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
