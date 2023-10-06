import React from 'react'
import ButtonListIcon from '../../ui/Button/ListIcon'
import Hr from '../../ui/Hr'
import { FirstPage, Article, GitHub, TravelExplore, People, Comment, Tag, Category } from '@mui/icons-material'

const lists = [
  { text: '首页', link: '/', icon: <FirstPage /> },
  { text: '文章', link: '/article/1', icon: <Article /> },
  { text: '开源之旅', link: '/opensource', icon: <TravelExplore /> },
  { text: '朋友们', link: '/friends', icon: <People /> },
  { text: '留言板', link: '/comments', icon: <Comment /> },
  { text: '标签', link: '/tags', icon: <Tag /> },
  { text: '分类', link: '/categories', icon: <Category /> },
  { text: 'GitHub', link: 'https://github.com/Plumbiu/blog', icon: <GitHub /> },
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
