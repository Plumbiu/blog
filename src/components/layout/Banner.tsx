'use client'

import styles from './Banner.module.css'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/client'

export default function Banner() {
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.setBannerHeight()
  }, [pathname])

  return (
    <div suppressHydrationWarning>
      <img
        suppressHydrationWarning
        className={cn('banner', styles.banner)}
        alt="banner"
        src="/banner/01.jpg"
      />
    </div>
  )
}
