'use client'

import { Link } from 'next-view-transitions'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/client'
import { BlogAuthor, GithubRepoUrl } from '~/data/site'
import { GithubIcon, MoonIcon, RssIcon, SearchIcon, SunIcon } from './Icons'
import styles from './Header.module.css'
import { usePathname } from 'next/navigation'
import useSearchPanelStore from '@/store/search-panel'

const rightData = [
  { href: '/rss.xml', children: <RssIcon />, target: '_blank' },
  { href: GithubRepoUrl, children: <GithubIcon />, target: '_blank' },
  { href: '/links', children: 'Links' },
  { href: '/about', children: 'About' },
]

function Header() {
  const ref = useRef<HTMLHeadingElement>(null)
  const [theme, setTheme] = useState<string>()
  const pathanme = usePathname()
  const showSearchPanel = useSearchPanelStore('show')
  const [visible, setVisible] = useState(true)

  function scrollHandler() {
    const y = window.scrollY
    console.log(y)
    setVisible(y < 480)
  }

  useEffect(() => {
    setTheme(window.getLocalTheme()!)
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  return (
    <div
      className={styles.header}
      style={{
        display: visible ? undefined : 'none',
      }}
    >
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
        <div
          className={styles.hover}
          onClick={() => {
            showSearchPanel()
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
  )
}

export default Header
