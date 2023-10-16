'use client'

import './index.css'
import { useEffect, useState } from 'react'
import { toggleTheme } from '@/lib/theme'
import { MoonIcon, SunIcon } from '@/components/icons'

const HeaderToggle = () => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    toggleTheme(mode)
  }, [mode])

  return (
    <div
      className="Header-Toggle Hover"
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      {mode ? <SunIcon /> : <MoonIcon />}
    </div>
  )
}

export default HeaderToggle
