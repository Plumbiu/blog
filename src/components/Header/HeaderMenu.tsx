'use client'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material'
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
      <Paper sx={{ maxWidth: '100%' }}>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
          {lists.map(({ text, link, icon }) => (
            <MenuItem
              key={text}
              component="a"
              href={link}
              sx={{
                py: 1.25,
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{text}</ListItemText>
            </MenuItem>
          ))}
          <Hr />
          <MenuItem
            component="a"
            href="https://github.com/Plumbiu/blog"
            sx={{
              py: 1.25,
            }}
          >
            <ListItemIcon>
              <GitHub fontSize="small" />
            </ListItemIcon>
            <ListItemText>Github</ListItemText>
          </MenuItem>
        </Menu>
      </Paper>
    </>
  )
}

export default HeaderMenu
