'use client'

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@/components/icons'

let anchor: HTMLElement

type Theme = 'dark' | 'light'

const HeaderToggle = () => {
  const [mode, setMode] = useState<Theme>()
  useEffect(() => {
    const theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
    if (theme) {
      setMode(theme as Theme)
    }
  }, [])
  function toggleTheme() {
    const theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
    if (!theme) {
      return
    }
    if (!anchor) {
      anchor = document.documentElement
    }
    anchor.setAttribute('theme', theme)
    localStorage.setItem('theme', theme)
    setMode(theme as Theme)
  }

  return (
    <div onClick={toggleTheme}>
      {mode === 'light' ? <SunIcon /> : <MoonIcon />}
    </div>
  )
}

export default HeaderToggle
