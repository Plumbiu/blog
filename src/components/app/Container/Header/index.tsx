import Link from 'next/link'
import Search from './Search'
import './index.css'
import HeaderToggle from './Toggle'
import HeaderMenu from './Menu'
import { RssIcon } from '@/components/icons'

const info = [
  {
    primary: 'rss',
    icon: <RssIcon />,
    href: '/rss.xml',
  },
]

export default function Header() {
  return (
    <div className="Header">
      <HeaderMenu />
      <div className="Header-Search">
        {info.map(({ primary, href, icon }) => (
          <Link key={primary} target="_blank" href={href} className="Hover">
            {icon}
          </Link>
        ))}
        <HeaderToggle />
        <Search
          id={process.env.APPLICATION_ID ?? ''}
          apiKey={process.env.API_KEY ?? ''}
          name={process.env.APPLICATION_NAME ?? ''}
        />
      </div>
    </div>
  )
}
