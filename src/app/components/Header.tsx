'use client'

import { Link } from 'next-view-transitions'
import styles from './Header.module.css'
import { GithubIcon, MoonIcon, RssIcon, SunIcon } from '@/app/components/Icons'
import clsx from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useMounted from '@/hooks/useMounted'
import { Dark, getLocalTheme, toggleDataTheme } from '@/utils/client/theme'

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const [themeState, setThemeState] = useState<string>()
  useLayoutEffect(() => {
    const theme = getLocalTheme()
    setThemeState(theme)
  }, [])
  const mounted = useMounted()

  function addShadowClassName() {
    const header = ref.current
    if (!header) {
      return
    }
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 120) {
      header.classList.add(styles.shadow)
    } else {
      header.classList.remove(styles.shadow)
    }
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
      <div className={clsx('center', styles.header)}>
        <div className={styles.left}>
          <Link href="/list/blog">Home</Link>
        </div>
        <div className={styles.right}>
          <a target="_blank" href="/rss.xml">
            <RssIcon />
          </a>
          <Link target="_blank" href="https://github.com/Plumbiu/blog">
            <GithubIcon />
          </Link>
          <div onClick={toggleDataTheme}>
            {themeState === Dark ? <SunIcon /> : <MoonIcon />}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
