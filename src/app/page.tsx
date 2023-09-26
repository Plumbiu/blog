import * as React from 'react'
import {
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemButton,
  Chip,
  ListItem,
} from '@mui/material'
import Main from '@/components/Main'
import { useRequest } from '@/lib/api'

export default async function Home() {
  const data = await useRequest<FullFrontMatter[]>('article')
  return (
    <Main>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {data.map((item) => (
          <ListItem key={item.id}>
            <ListItemButton
              component="a"
              href={'article/' + item.id}
              alignItems="flex-start"
              sx={{
                cursor: 'pointer',
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: '#9C27B0',
                    width: 48,
                    height: 48,
                  }}
                >
                  {item.tags?.[0] || item.title[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.title}
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="#9C27B0"
                    >
                      {item.tags?.map((tag) => (
                        <Chip
                          component="span"
                          sx={{
                            mr: 1,
                          }}
                          key={tag}
                          label={tag}
                          size="small"
                        />
                      ))}
                    </Typography>
                    {item.desc + '...'}
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Main>
  )
}
