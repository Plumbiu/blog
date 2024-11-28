'use client'

import { Link } from 'next-view-transitions'
import { useEffect, useRef } from 'react'
import {
  GithubIcon,
  RssIcon,
  SearchIcon,
  ThemeIcon,
} from '@/app/_components/Icons'
import { applyTheme, Dark, Light, toggleDataTheme } from '@/utils/client/theme'
import styles from './Header.module.css'
import Selector from './Selector'

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const prevScrollTop = useRef(0)
  const systemTheme = useRef<string | null>(null)

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
          <Link className={styles.mobile} href="/links">
            Links
          </Link>
          <Selector
            title={<ThemeIcon />}
            items={[
              {
                value: 'system',
                label: '⚙️ system',
              },
              {
                value: Light,
                label: `☀️ ${Light}`,
              },
              {
                value: Dark,
                label: `🌖 ${Dark}`,
              },
            ]}
            onChange={(value) => {
              if (value === 'system') {
                if (!systemTheme.current) {
                  systemTheme.current = window.matchMedia(
                    '(prefers-color-scheme: light)',
                  ).matches
                    ? Light
                    : Dark
                }
                applyTheme(systemTheme.current)
              } else {
                applyTheme(value)
              }
            }}
          />
          <Link target="_blank" href="/rss.xml">
            <RssIcon />
          </Link>
          <Link target="_blank" href="https://github.com/Plumbiu/blog">
            <GithubIcon />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
