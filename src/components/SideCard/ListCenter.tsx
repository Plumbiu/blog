'use client'
import {
  Badge,
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'
import type { Props } from './ListTop'
import type { FC } from 'react'

const ListCenter: FC<Props> = ({ blogInfo, githubInfo }) => {
  return (
    <>
      <ListItem
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Stack direction="row" spacing={2}>
          {blogInfo.map(({ href, primary, count }) => (
            <Button key={href} component="a" href={href}>
              <Badge badgeContent={count} color="secondary">
                {primary}
              </Badge>
            </Button>
          ))}
        </Stack>
      </ListItem>
      {githubInfo.map(({ icon, primary, href }) =>
        href ? (
          <ListItemButton
            key={href ?? primary}
            component="a"
            href={href}
            target="__blank"
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
          </ListItemButton>
        ) : (
          <ListItemButton key={href ?? primary}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
          </ListItemButton>
        ),
      )}
    </>
  )
}

export default ListCenter
