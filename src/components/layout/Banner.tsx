import styles from './Banner.module.css'
import { cn } from '@/lib/client'
import Image from 'next/image'
import { getBase64Url, resolveBasePath } from '@/lib/shared'
import blurhashMap from '~/data/banner.json'

const BannerName = '01.jpg'

export default function Banner() {
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
      <script src={resolveBasePath('assets/banner.js')} />
    </div>
  )
}
