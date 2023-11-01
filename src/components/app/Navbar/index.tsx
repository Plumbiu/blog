import Link from 'next/link'
import type { FC } from 'react'
import './index.css'
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
  { text: '文章', link: '/article/1', icon: <ArticleIcon /> },
  { text: '开源之旅', link: '/opensource', icon: <TravelExploreIcon /> },
  { text: '朋友们', link: '/friend', icon: <PeopleIcon /> },
  { text: '标签', link: '/tag', icon: <TagIcon /> },
  { text: '分类', link: '/category', icon: <CategoryIcon /> },
  { text: '实验室', link: '/lab', icon: <LabIcon /> },
]

const page: FC<Props> = ({}) => {
  return (
    <div className="Header-Right-Icon">
      {lists.map(({ link, icon }) => (
        <Link href={link}>{icon}</Link>
      ))}
    </div>
  )
}

export default page
