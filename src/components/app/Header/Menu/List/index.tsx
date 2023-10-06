import React from 'react'
import ButtonListIcon from '../../../../ui/Button/ListIcon'
import Hr from '../../../../ui/Hr'
import {
  ArticleIcon,
  CategoryIcon,
  CommentIcon,
  FirstPageIcon,
  GithubIcon,
  PeopleIcon,
  TagIcon,
  TravelExploreIcon,
} from '@/components/icons'

const lists = [
  { text: '首页', link: '/', icon: <FirstPageIcon /> },
  { text: '文章', link: '/article/1', icon: <ArticleIcon /> },
  { text: '开源之旅', link: '/opensource', icon: <TravelExploreIcon /> },
  { text: '朋友们', link: '/friends', icon: <PeopleIcon /> },
  { text: '留言板', link: '/comments', icon: <CommentIcon /> },
  { text: '标签', link: '/tags', icon: <TagIcon /> },
  { text: '分类', link: '/categories', icon: <CategoryIcon /> },
  { text: 'GitHub', link: 'https://github.com/Plumbiu/blog', icon: <GithubIcon /> },
]

const MenuList = () => {
  return lists.map(({ text, link, icon }, index) => (
    <div key={text}>
      <ButtonListIcon blank={false} icon={icon} py={10} text={text} link={link} />
      {index % 3 ? undefined : <Hr />}
    </div>
  ))
}

export default MenuList
