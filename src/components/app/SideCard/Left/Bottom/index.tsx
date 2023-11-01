import { Fragment } from 'react'
import Button from '@/components/ui/Button'
import './index.css'
import Badge from '@/components/ui/Badge'
import ButtonListIcon from '@/components/ui/Button/ListIcon'
import { articleNum } from '~/config/sideCard.json'
import Stack from '@/components/ui/Stack'
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

const githubInfo = [
  {
    primary: github_name,
    icon: <GithubIcon />,
    href: `https://github.com/${github_name}`,
  },

  {
    primary: twitter,
    icon: <TwitterIcon />,
    href: `https://twitter.com/${twitter}`,
  },
  {
    primary: url,
    icon: <LinkIcon />,
    href: url,
  },
  {
    primary: 'rss',
    icon: <RssIcon />,
    href: '/rss.xml',
  },
]

const SideCardBottom = () => {
  return (
    <div className="Side-LB">
      <div className="Side-LB-List">
        {githubInfo.map(({ icon, primary, href }) => icon)}
      </div>
    </div>
  )
}

export default SideCardBottom
