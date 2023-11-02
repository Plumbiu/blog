'use client'

import Link from 'next/link'
import { useEffect, type FC } from 'react'
import './index.css'
import { usePathname } from 'next/navigation'
import {
  ArticleIcon,
  TravelExploreIcon,
  PeopleIcon,
  TagIcon,
  CategoryIcon,
  LabIcon,
} from '@/components/icons'

interface Props {}
const lists = [
  {
    text: '文章',
    link: '/article',
    icon: <ArticleIcon />,
  },
  { text: '开源之旅', link: '/opensource', icon: <TravelExploreIcon /> },
  { text: '朋友们', link: '/friend', icon: <PeopleIcon /> },
  { text: '标签', link: '/tag', icon: <TagIcon /> },
  { text: '分类', link: '/category', icon: <CategoryIcon /> },
  { text: '实验室', link: '/lab', icon: <LabIcon /> },
]

const Nav: FC<Props> = ({}) => {
  const path = usePathname()

  return (
    <div className="Navbar">
      {lists.map(({ link, icon, text }) => (
        <Link
          key={text}
          className={`Navbar-Link ${
            path.includes(link) ? 'Navbar-Link-Active' : ''
          }`}
          href={link + '#' + link.slice(1)}
        >
          <span
            style={{
              opacity: path.includes(link) ? 1 : 0,
            }}
            className="Navbar-Title"
          >
            {text}
          </span>
          {icon}
        </Link>
      ))}
    </div>
  )
}

export default Nav
