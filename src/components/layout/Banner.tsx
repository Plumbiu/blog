'use client'

import styles from './Banner.module.css'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/client'
import Image from 'next/image'
import { getBase64Url } from '@/lib/shared'
import blurhashMap from '~/data/banner.json'

const BannerName = '01.jpg'

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
        placeholder="blur"
        blurDataURL={getBase64Url(blurhashMap[BannerName])}
        className={cn('blog_banner', styles.banner)}
        alt="banner"
        src={`/banner/${BannerName}`}
      />
    </div>
  )
}
