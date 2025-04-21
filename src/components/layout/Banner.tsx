'use client'

import styles from './Banner.module.css'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/client'
import Image from 'next/image'

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
      <Image
        width={1920}
        height={1080}
        suppressHydrationWarning
        className={cn('blog_banner', styles.banner)}
        alt="banner"
        src="/banner/01.jpg"
      />
    </div>
  )
}
