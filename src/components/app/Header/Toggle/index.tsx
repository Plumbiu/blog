'use client'

import './index.css'
import { useEffect, useState } from 'react'
import { toggleTheme } from '@/lib/theme'
import { MoonIcon, SunIcon } from '@/components/icons'

const HeaderToggle = () => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    toggleTheme(isDark)
  }, [isDark])

  return (
    <div className="Header-Toggle Hover" onClick={() => setIsDark(!isDark)}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </div>
  )
}

export default HeaderToggle
