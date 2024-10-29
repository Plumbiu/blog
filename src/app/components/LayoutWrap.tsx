'use client'

import { ReactNode, useLayoutEffect, useState } from 'react'
import { ViewTransitions } from 'next-view-transitions'
import { applyCurrentTheme } from '@/utils/client/theme'

interface ThemeWrap {
  children: ReactNode
}

function LayoutWrap(props: ThemeWrap) {
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    applyCurrentTheme()
    setMounted(true)
    window.addEventListener('storage', applyCurrentTheme)
    return () => {
      window.removeEventListener('storage', applyCurrentTheme)
    }
  }, [])

  return <ViewTransitions>{mounted && props.children}</ViewTransitions>
}

export default LayoutWrap
