import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import HeaderMenu from './HeaderMenu'
import '@docsearch/css'
import Search from './Search'

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
          <HeaderMenu />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Plumbiu の 小屋
          </Typography>
          <Search
            id={process.env.APPLICATION_ID ?? ''}
            apiKey={process.env.API_KEY ?? ''}
            name="plumbiu"
          />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
