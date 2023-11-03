import type { FC } from 'react'
import './index.css'
import { EmailIcon, LocationIcon, RssIcon } from '@/components/icons'
import { location, email } from '~/config.json'

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
      <div>
        <h1>Plumbiu の 小屋</h1>
      </div>
      <div className="Header-Banner-Icon">
        {info.map(({ primary, icon }) => (
          <div>{icon}</div>
        ))}
      </div>
    </div>
  )
}

export default HeaderBanner
