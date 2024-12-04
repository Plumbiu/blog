'use client'

import { Link } from 'next-view-transitions'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/utils/client'
import { GithubIcon, MoonIcon, SunIcon } from '@/app/_components/Icons'
import { applyTheme, Dark, Light } from '@/utils/client/theme'
import styles from './Header.module.css'

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const prevScrollTop = useRef(0)
  const [theme, setTheme] = useState<string>()
  useLayoutEffect(() => {
    setTheme(localStorage.getItem('data-theme')!)
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
        <div className={cn(styles.left, styles.hover)}>
          <Link href="/list/blog/1" className="fcc">
            Plumbiu
          </Link>
        </div>
        <div className={styles.right}>
          {theme && (
            <div
              className={styles.hover}
              onClick={() => {
                const nextTheme = theme === Dark ? Light : Dark
                setTheme(nextTheme)
                applyTheme(nextTheme)
              }}
            >
              {theme === Dark ? <SunIcon /> : <MoonIcon />}
            </div>
          )}
          <Link
            className={styles.hover}
            target="_blank"
            href="https://github.com/Plumbiu/blog"
          >
            <GithubIcon />
          </Link>
          <Link className={styles.hover} href="/links">
            Links
          </Link>
          <Link className={styles.hover} href="/about">
            About
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
