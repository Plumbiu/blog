'use client'

import { ReactNode, useLayoutEffect, useState } from 'react'
import { ViewTransitions } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { applyCurrentTheme } from '@/utils/client/theme'
import ArtStar from './ArtStar'

interface ThemeWrap {
  children: ReactNode
}

function LayoutWrap(props: ThemeWrap) {
  const [mounted, setMounted] = useState(false)
  // const pathname = usePathname()
  // const isPost = pathname.includes('/posts/')

  useLayoutEffect(() => {
    applyCurrentTheme()
    setMounted(true)
    window.addEventListener('storage', applyCurrentTheme)
    return () => {
      window.removeEventListener('storage', applyCurrentTheme)
    }
  }, [])

  return (
    <>
      {/* {!isPost && <ArtStar />} */}
      <ViewTransitions>{mounted && props.children}</ViewTransitions>
    </>
  )
}

export default LayoutWrap
