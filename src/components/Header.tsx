'use client'

import { Link } from 'next-view-transitions'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/client'
import { BlogAuthor, GithubRepoUrl } from '~/data/site'
import { GithubIcon, MoonIcon, RssIcon, SearchIcon, SunIcon } from './Icons'
import styles from './Header.module.css'
import { usePathname } from 'next/navigation'
import ModalLoading from './ModalLoading'

const SearchPanel = lazy(() => import('./SearchPanel'))

const rightData = [
  { href: '/rss.xml', children: <RssIcon />, target: '_blank' },
  { href: GithubRepoUrl, children: <GithubIcon />, target: '_blank' },
  { href: '/links', children: 'Links' },
  { href: '/about', children: 'About' },
]

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const prevScrollTop = useRef(0)
  const [theme, setTheme] = useState<string>()
  const pathanme = usePathname()
  const [searchVisible, setSearchVisible] = useState(false)

  useEffect(() => {
    setTheme(window.getLocalTheme()!)
  }, [])

  const addShadowClassName = useCallback(() => {
    const header = ref.current!
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    const prevTop = prevScrollTop.current
    if (scrollTop > prevTop) {
      header.classList.add(styles.hide)
    } else {
      header.classList.remove(styles.hide)
    }
    if (scrollTop > 68) {
      header.classList.add(styles.shadow)
    } else {
      header.classList.remove(styles.shadow)
    }
    prevScrollTop.current = scrollTop
  }, [])

  useEffect(() => {
    addShadowClassName()
    window.addEventListener('scroll', addShadowClassName)
    return () => {
      window.removeEventListener('scroll', addShadowClassName)
    }
  }, [])

  return (
    <>
      <header ref={ref} className={styles.wrap}>
        <div className={styles.header}>
          <div className={cn(styles.left, styles.hover)}>
            <Link aria-label="Home page" href="/list/blog/1" className="fcc">
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
            <div
              className={styles.hover}
              onClick={() => {
                setSearchVisible(true)
              }}
            >
              <SearchIcon />
            </div>
            {rightData.map((data) => (
              <Link
                key={data.href}
                href={data.href}
                target={data.target}
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
        </div>
      </header>
      <Suspense
        fallback={<ModalLoading hide={() => setSearchVisible(false)} />}
      >
        {searchVisible && <SearchPanel setSearchVisible={setSearchVisible} />}
      </Suspense>
    </>
  )
}

export default Header
