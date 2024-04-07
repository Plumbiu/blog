'use client'

import Link from 'next/link'
import { useScroll } from 'ahooks'
import './index.css'
import { useEffect, useState } from 'react'
import HeaderMenu from './Menu/index'
import HeaderTitle from './Title'
import { MoonIcon, RssIcon, SunIcon } from '@/components/icons'

const info = [
  {
    primary: 'rss',
    icon: <RssIcon />,
    href: '/rss.xml',
  },
]
type Theme = 'dark' | 'light'

function nextTheme() {
  return localStorage.getItem('theme')
}

let beaudarFrame: HTMLIFrameElement | null | undefined = undefined

export default function Header() {
  const pos = useScroll()
  const [mode, setMode] = useState<Theme>()

  useEffect(() => {
    const theme = nextTheme()
    beaudarFrame = document.querySelector('iframe')
    beaudarFrame?.contentWindow?.postMessage({
      type: 'set-theme',
      theme: `github-${theme}`,
    }, 'https://beaudar.lipk.org')
    setMode(theme as Theme)
  }, [])

  function toggleTheme() {
    const theme = nextTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('theme', theme)
    localStorage.setItem('theme', theme)
    beaudarFrame?.contentWindow?.postMessage({
      type: 'set-theme',
      theme: `github-${theme}`,
    }, 'https://beaudar.lipk.org')
    console.log(beaudarFrame)
    setMode(theme)
  }

  return (
    <div className="Header">
      <div
        className={`Header-Top ${
          pos && pos.top > 160 ? 'Header-Top-Absolute' : ''
        }`}
      >
        <HeaderMenu />
        <div className="Header-Search">
          <div onClick={toggleTheme}>
            {mode && (mode === 'light' ? <SunIcon /> : <MoonIcon />)}
          </div>
          {info.map(({ primary, href, icon }) => (
            <Link key={primary} target="_blank" href={href}>
              {icon}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <HeaderTitle />
      </div>
    </div>
  )
}
