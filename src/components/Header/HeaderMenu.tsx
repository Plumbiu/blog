'use client'
import {
  Divider,
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
} from '@mui/icons-material'

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
          <MenuItem component="a" href="/myself">
            <ListItemIcon>
              <FirstPage fontSize="small" />
            </ListItemIcon>
            <ListItemText>首页</ListItemText>
          </MenuItem>
          <MenuItem component="a" href="/article/1">
            <ListItemIcon>
              <Article fontSize="small" />
            </ListItemIcon>
            <ListItemText>文章</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem component="a" href="https://github.com/Plumbiu/blog">
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
