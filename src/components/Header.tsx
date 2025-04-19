'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/client'
import { BlogAuthor } from '~/data/site'
import { MoonIcon, SunIcon } from './Icons'
import styles from './Header.module.css'
import { usePathname } from 'next/navigation'

const rightData = [
  { href: '/links', children: 'Links' },
  { href: '/about', children: 'About' },
]

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const [theme, setTheme] = useState<string>()
  const pathanme = usePathname()
  const pathname = usePathname()

  function scrollHandler() {
    const y = window.scrollY
    const dom = ref.current!
    dom.style.transform =
      y < 400 ? 'translateY(0)' : 'translateY(calc(-1 * var(--header-h)))'
  }

  useEffect(() => {
    const main: HTMLDivElement | null = document.querySelector('.main_layout')
    if (!main) {
      return
    }
    if (pathname === '/' || pathname.startsWith('/list')) {
      // main.style.marginTop = 'calc(var(--header-h) + 384px)'
    } else {
      // main.style.marginTop = 'calc(var(--header-h) + 120px)'
    }
  }, [pathanme])

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
        {rightData.map((data) => (
          <Link
            key={data.href}
            href={data.href}
            className={cn(styles.hover, {
              [styles.active]: pathanme === data.href,
              [styles.mobile]:
                data.href === '/rss.xml' || data.href === '/links',
            })}
            prefetch={data.href !== '/rss.xml'}
          >
            {data.children}
          </Link>
        ))}
      </div>
    </header>
  )
}

export default Header
