import Link from 'next/link'
import Chips from './Chips'
import { useGet } from '@/lib/api'
import './index.css'
import {
  EmailIcon,
  GithubIcon,
  LinkIcon,
  LocationIcon,
  ReadMoreIcon,
  RssIcon,
  TwitterIcon,
} from '@/components/icons'
import {
  github_name,
  twitter,
  url,
  location,
  email,
  articleNum,
} from '@/lib/json'

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

const Side = async () => {
  const tags = await useGet<Tag[]>('tag')
  const categories = await useGet<Category[]>('category')
  const archeveYear = await useGet<IArcheveYear[]>('archive/year')

  return (
    <div className="Side">
      <div>
        <div className="Side-Title">
          <span>标签</span>
          {tags.length > 15 && (
            <Link className="Side-Title-Link" href="/">
              <ReadMoreIcon />
            </Link>
          )}
        </div>
        <Chips path="tag" chips={tags.slice(0, 15)} />
      </div>
      <div>
        <div className="Side-Title">分类</div>
        <Chips path="category" chips={categories.slice(0, 15)} />
      </div>
      <div>
        <div className="Side-Title">归档</div>
        {archeveYear.map(({ year, num }) => (
          <Link
            key={year}
            href={'/archive/' + year}
            className="Hover Side-Archive-Link"
          >
            <div>{year}年</div>
            <div>{num}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Side
