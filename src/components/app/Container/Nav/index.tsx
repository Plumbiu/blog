'use client'

import Link from 'next/link'
import { type FC } from 'react'
import './index.css'
import {
  ArticleIcon,
  TravelExploreIcon,
  PeopleIcon,
  TagIcon,
  CategoryIcon,
  LabIcon,
  FirstPageIcon,
} from '@/components/icons'

interface Props {}
const lists = [
  { text: '首页', link: '/', icon: <FirstPageIcon /> },
  {
    text: '文章',
    link: '/article',
    icon: <ArticleIcon />,
  },
  { text: '朋友们', link: '/friend', icon: <PeopleIcon /> },
  { text: '实验室', link: '/lab', icon: <LabIcon /> },
  { text: '标签', link: '/tag', icon: <TagIcon /> },
  { text: '分类', link: '/category', icon: <CategoryIcon /> },
  { text: '开源之旅', link: '/opensource', icon: <TravelExploreIcon /> },
]

const Nav: FC<Props> = ({}) => {
  return (
    <div className="Navbar">
      {lists.map(({ link, icon, text }) => (
        <Link
          key={text}
          scroll={false}
          className="Navbar-Link"
          href={link + '#' + link.slice(1)}
        >
          {icon}
        </Link>
      ))}
    </div>
  )
}

export default Nav
