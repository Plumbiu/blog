'use client'

import Link from 'next/link'
import { useScroll } from 'ahooks'
import './index.css'
import HeaderToggle from './Toggle'
import HeaderMenu from './Menu/index'
import HeaderTitle from './Title'
import { RssIcon } from '@/components/icons'

const info = [
  {
    primary: 'rss',
    icon: <RssIcon />,
    href: '/rss.xml',
  },
]

export default function Header() {
  const pos = useScroll()
  return (
    <div className="Header">
      <div
        className={`Header-Top ${
          pos && pos.top > 160 ? 'Header-Top-Absolute' : ''
        }`}
      >
        <HeaderMenu />
        <div className="Header-Search">
          <HeaderToggle />
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
