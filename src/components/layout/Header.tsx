'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/client'
import { BlogAuthor } from '~/data/site'
import {
  HomeIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  LinkIcon,
  MyselfIcon,
} from '../Icons'
import styles from './Header.module.css'
import Selector from '../ui/Selector'
import { usePathname } from 'next/navigation'

const rightData = [
  {
    href: '/links',
    children: (
      <div className={styles.label}>
        <LinkIcon />
        <div>Links</div>
      </div>
    ),
  },
  {
    href: '/about',
    children: (
      <div className={styles.label}>
        <MyselfIcon />
        <div>About</div>
      </div>
    ),
  },
]

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const [theme, setTheme] = useState<string>()

  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.setBannerHeight()
  }, [pathname])

  function scrollHandler() {
    const y = window.scrollY
    const dom = ref.current!
    const pathname = location.pathname
    const isList = pathname === '/' || pathname.startsWith('/list')
    let thresholdY = window.innerWidth < 960 ? 190 : 360
    if (!isList) {
      thresholdY -= 120
    }
    dom.style.transform =
      y < thresholdY
        ? 'translateY(0)'
        : 'translateY(calc(-1 * var(--header-h)))'
  }

  useEffect(() => {
    scrollHandler()
    setTheme(window.getLocalTheme()!)
    window.addEventListener('scroll', scrollHandler)


    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  return (
    <header ref={ref} className={styles.header}>
      <div className={cn(styles.left, styles.hover)}>
        <Link aria-label="Home page" href="/" className="fcc">
          <HomeIcon />
          {BlogAuthor}
        </Link>
      </div>
      <div className={styles.right}>
        {theme && (
          <div
            className={styles.hover}
            onClick={() => {
              const nextTheme =
                theme === window.Dark ? window.Light : window.Dark
              setTheme(nextTheme)
              window.setTheme(nextTheme)
            }}
          >
            {theme === window.Dark ? <SunIcon /> : <MoonIcon />}
          </div>
        )}
        <Selector
          offset={{
            y: 24,
          }}
          items={rightData.map((data) => ({
            label: (
              <Link
                key={data.href}
                href={data.href}
                prefetch={data.href !== '/rss.xml'}
              >
                {data.children}
              </Link>
            ),
            value: data.href,
          }))}
        >
          <div className={styles.hover}>
            <MenuIcon />
          </div>
        </Selector>
      </div>
    </header>
  )
}

export default Header
