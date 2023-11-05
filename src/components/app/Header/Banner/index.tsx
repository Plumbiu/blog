import type { FC } from 'react'
import './index.css'
import Image from 'next/image'
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
      <Image width={50} height={50} src="/avatar.jpg" alt="avatar" />
      <div>
        <div>@ Plumbiu</div>
      </div>
    </div>
  )
}

export default HeaderBanner
