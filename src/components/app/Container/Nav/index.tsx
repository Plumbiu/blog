'use client'

import Link from 'next/link'
import { type FC } from 'react'
import './index.css'
import { usePathname } from 'next/navigation'
import {
  ArticleIcon,
  TravelExploreIcon,
  PeopleIcon,
  TagIcon,
  CategoryIcon,
  LabIcon,
  FirstPageIcon,
  ArchiveIcon,
} from '@/components/icons'

interface Props {}

const lists = [
  { text: '首页', link: '/', icon: <FirstPageIcon />, alias: 'home' },
  {
    text: '文章',
    link: '/article',
    icon: <ArticleIcon />,
    alias: 'article',
  },
  { text: '朋友们', link: '/friend', icon: <PeopleIcon />, alias: 'friend' },
  { text: '归档', link: '/archive', icon: <ArchiveIcon />, alias: 'archive' },
  { text: '实验室', link: '/lab', icon: <LabIcon />, alias: 'lab' },
  { text: '标签', link: '/tag', icon: <TagIcon />, alias: 'tag' },
  {
    text: '分类',
    link: '/category',
    icon: <CategoryIcon />,
    alias: 'category',
  },
  {
    text: '开源之旅',
    link: '/opensource',
    icon: <TravelExploreIcon />,
    alias: 'opensource',
  },
]

const Nav: FC<Props> = ({}) => {
  let path = usePathname()
  if (path === '/') {
    path = 'home'
  } else if (path.includes('post')) {
    path = 'article'
  }

  return (
    <div className="Navbar">
      {lists.map(({ link, icon, text, alias }) => (
        <Link
          key={text}
          scroll={false}
          className={`Navbar-Link ${
            path.includes(alias) ? 'Navbar-Link-Active' : ''
          }`}
          href={link}
        >
          {path.includes(alias) && <div className="Navbar-Text">{text}</div>}
          {icon}
        </Link>
      ))}
    </div>
  )
}

export default Nav
