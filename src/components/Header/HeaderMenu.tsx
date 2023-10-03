'use client'
import { IconButton, Menu } from '@mui/material'
import React, { useState } from 'react'
import { Menu as MenuIcon } from '@mui/icons-material'
import MenuList from './MenuList'

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
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClick={handleClose}
          sx={{
            '.css-6hp17o-MuiList-root-MuiMenu-list': {
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
        >
          <MenuList hr />
        </Menu>
      </div>
    </>
  )
}

export default HeaderMenu
