import type { FC } from 'react'
import './index.css'
import { EmailIcon, LocationIcon, RssIcon } from '@/components/icons'
import { location, email } from '@/lib/json'

interface Props {}

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

const HeaderBanner: FC<Props> = ({}) => {
  return (
    <div className="Header-Banner">
      {info.map(({ primary, icon }) => (
        <div key={primary}>{icon}</div>
      ))}
    </div>
  )
}

export default HeaderBanner
