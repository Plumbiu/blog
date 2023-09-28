import * as React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Plumbiu の 小屋
          </Typography>
          <div
            style={{
              position: 'relative',
            }}
          >
            <div
              style={{
                padding: 1,
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </div>
            <InputBase
              placeholder="搜索文章"
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: 'inherit',
                padding: '4px 4px 4px 0',
                paddingLeft: '2em',
                width: '100%',
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
