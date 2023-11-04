import Search from './Search'
import './index.css'
import HeaderToggle from './Toggle'
import HeaderMenu from './Menu'
import { EmailIcon, LocationIcon, RssIcon } from '@/components/icons'
import { location, email } from '@/lib/json'

const info = [
  {
    primary: 'rss',
    icon: <RssIcon />,
    href: '/rss.xml',
  },
  { primary: location, icon: <LocationIcon /> },
  {
    primary: email,
    icon: <EmailIcon />,
  },
]

export default function Header() {
  return (
    <div className="Header">
      <HeaderMenu />
      <div className="Header-Search">
        {info.map(({ primary, icon }) => (
          <div className="Hover" key={primary}>
            {icon}
          </div>
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
