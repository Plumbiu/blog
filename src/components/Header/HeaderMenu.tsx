'use client'
import { IconButton, Menu } from '@mui/material'
import React, { useState } from 'react'
import {
  Menu as MenuIcon,
  FirstPage,
  Article,
  GitHub,
  TravelExplore,
  People,
  Comment,
  Tag,
  Category,
} from '@mui/icons-material'
import Hr from '../ui/Hr'
import ButtonIcon from '../ui/Button/Icon'

const lists = [
  { text: '首页', link: '/', icon: <FirstPage /> },
  { text: '文章', link: '/article/1', icon: <Article /> },
  { text: '开源之旅', link: '/', icon: <TravelExplore /> },
  { text: '朋友们', link: '/friends', icon: <People /> },
  { text: '留言板', link: '/comments', icon: <Comment /> },
  { text: '标签', link: '/tags', icon: <Tag /> },
  { text: '分类', link: '/categories', icon: <Category /> },
]

const HeaderMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={handleClick}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <div style={{ maxWidth: '100%', padding: '0 4px' }}>
        <Menu open={open} anchorEl={anchorEl} onClick={handleClose}>
          {lists.map(({ text, link, icon }) => (
            <ButtonIcon
              blank={false}
              icon={icon}
              mw={36}
              py={10}
              text={text}
              link={link}
            />
          ))}
          <Hr />
          <ButtonIcon
            blank={false}
            icon={<GitHub />}
            mw={36}
            py={10}
            text="GitHub"
            link="https://github.com/Plumbiu/blog"
          />
        </Menu>
      </div>
    </>
  )
}

export default HeaderMenu
