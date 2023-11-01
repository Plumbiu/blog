import './index.css'
import Link from 'next/link'
import { articleNum } from '~/config/sideCard.json'
import {
  GithubIcon,
  EmailIcon,
  LocationIcon,
  TwitterIcon,
  LinkIcon,
  RssIcon,
} from '@/components/icons'
import { github_name, twitter, url, location, email } from '~/config.json'

const info = [
  {
    primary: '开源之旅',
    href: '/opensource',
  },
  {
    primary: '实验室',
    href: '/lab',
  },
]
const blogInfo = [
  { primary: '归档', href: '/archive' },
  { primary: '文章', href: '/article/1', count: articleNum },
  {
    primary: '朋友',
    href: '/friend',
  },
]
const myInfo = [
  {
    primary: email,
    icon: <EmailIcon />,
  },
  { primary: location, icon: <LocationIcon /> },
]

const btmInfo = [
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

const SideCardBottom = () => {
  return (
    <div className="Side-LB">
      <div className="Side-LB-List">
        {btmInfo.map(({ icon, href }) => (
          <Link key={href} href={href}>
            {icon}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SideCardBottom
