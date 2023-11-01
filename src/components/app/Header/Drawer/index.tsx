import type { FC } from 'react'
import './index.css'
import Image from 'next/image'
import Link from 'next/link'
import {
  GithubIcon,
  TwitterIcon,
  LinkIcon,
  RssIcon,
  ExpandIcon,
} from '@/components/icons'
import { github_name, twitter, url } from '~/config.json'

interface Props {}
const drawInfo = [
  {
    icon: <GithubIcon />,
    href: `https://github.com/${github_name}`,
  },

  {
    icon: <TwitterIcon />,
    href: `https://twitter.com/${twitter}`,
  },
  {
    icon: <LinkIcon />,
    href: url,
  },
  {
    icon: <RssIcon />,
    href: '/rss.xml',
  },
]

const HeaderDrawer: FC<Props> = ({}) => {
  return (
    <div className="Header-Drawer">
      <ExpandIcon />
      <div className="Header-Drawer-Link">
        {drawInfo.map(({ icon, href }) => (
          <Link href={href}>{icon}</Link>
        ))}
      </div>
    </div>
  )
}

export default HeaderDrawer
