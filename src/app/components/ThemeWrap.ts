'use client'

import { applyCurrentTheme } from '@/utils/client/theme'
import { ReactNode, useLayoutEffect, useState } from 'react'

interface ThemeWrap {
  children: ReactNode
}

function ThemeWrap(props: ThemeWrap) {
  const [mounted, setMounted] = useState(false)
  useLayoutEffect(() => {
    applyCurrentTheme()
    setMounted(true)
    window.addEventListener('storage', applyCurrentTheme)
    return () => window.removeEventListener('storage', applyCurrentTheme)
  }, [])

  return mounted && props.children
}

export default ThemeWrap
