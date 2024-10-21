'use client'

import { applyCurrentTheme } from '@/utils/client/theme'
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ViewTransitions } from 'next-view-transitions'

interface ThemeWrap {
  children: ReactNode
}

function LayoutWrap(props: ThemeWrap) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  useLayoutEffect(() => {
    applyCurrentTheme()
    setMounted(true)
    window.addEventListener('storage', applyCurrentTheme)
    return () => {
      window.removeEventListener('storage', applyCurrentTheme)
    }
  }, [])

  useEffect(() => {
    console.log(pathname)
  }, [pathname])

  return (
    <ViewTransitions>
      {mounted && props.children}
    </ViewTransitions>
  )
}

export default LayoutWrap
