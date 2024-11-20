'use client'

import { ReactNode, Suspense, useLayoutEffect, useState } from 'react'
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
      {mounted && props.children}
    </>
  )
}

export default LayoutWrap
