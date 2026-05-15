// components/ui/ThemeToggle.tsx
'use client'
import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  return (
    <button onClick={() => setDark(!dark)} aria-label="Toggle theme">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
