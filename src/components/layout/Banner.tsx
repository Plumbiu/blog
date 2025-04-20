'use client'

import styles from './Banner.module.css'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/client'
import Selector from '../ui/Selector'
import Link from 'next/link'

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
    <div suppressHydrationWarning className={cn(styles.wrap)}>
      <img
        suppressHydrationWarning
        className={cn('banner', styles.banner)}
        alt="banner"
        src="/banner/01.jpg"
      />
      <div className={cn('fcc', styles.credit)}>
        <Selector
          items={[
            {
              label: <Link href="/list/blog">Blog</Link>,
              value: 'blog',
            },
          ]}
        >
          一头鹿一头鹿
        </Selector>
      </div>
    </div>
  )
}
