'use client'

import { Link } from 'next-view-transitions'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  GithubIcon,
  MoonIcon,
  RssIcon,
  SearchIcon,
  SunIcon,
} from '@/app/_components/Icons'
import {
  Dark,
  getLocalTheme,
  handleLightMediaChange,
  toggleDataTheme,
} from '@/utils/client/theme'
import styles from './Header.module.css'

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const [themeState, setThemeState] = useState<string>()
  const prevScrollTop = useRef(0)
  useLayoutEffect(() => {
    const { theme, lightMedia } = getLocalTheme()
    setThemeState(theme)
    lightMedia.addEventListener('change', handleLightMediaChange)
    return () => {
      lightMedia.removeEventListener('change', handleLightMediaChange)
    }
  }, [])

  function addShadowClassName() {
    const header = ref.current
    if (!header) {
      return
    }
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    const prevTop = prevScrollTop.current
    if (scrollTop > prevTop) {
      header.classList.add(styles.hide)
    } else {
      header.classList.remove(styles.hide)
    }
    if (scrollTop > 120) {
      header.classList.add(styles.shadow)
    } else {
      header.classList.remove(styles.shadow)
    }
    prevScrollTop.current = scrollTop
  }

  useEffect(() => {
    addShadowClassName()
    window.addEventListener('scroll', addShadowClassName)
    return () => {
      window.removeEventListener('scroll', addShadowClassName)
    }
  }, [])

  return (
    <header ref={ref} className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Link href="/">Plumbiu's Blog</Link>
        </div>
        <div className={styles.right}>
          <Link className={styles.mobile} href="/about">
            About
          </Link>
          <Link className={styles.mobile} href="/links">
            Links
          </Link>
          <div>
            <SearchIcon />
          </div>
          <a target="_blank" href="/rss.xml">
            <RssIcon />
          </a>
          <Link target="_blank" href="https://github.com/Plumbiu/blog">
            <GithubIcon />
          </Link>
          <div
            onClick={() => {
              const nextTheme = toggleDataTheme()
              setThemeState(nextTheme)
            }}
          >
            {themeState === Dark ? <SunIcon /> : <MoonIcon />}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header