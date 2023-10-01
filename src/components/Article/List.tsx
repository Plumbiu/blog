import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material'
import type { FC } from 'react'

interface Props {
  list: FullFrontMatter[]
}

const ArticleList: FC<Props> = ({ list }) => {
  return (
    <List sx={{ width: '100%', bgcolor: '#fff' }}>
      {list.map((item) => (
        <ListItemButton
          key={item.id}
          component="a"
          href={'/post/' + item.id}
          alignItems="flex-start"
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: '#9C27B0',
                width: 48,
                height: 48,
                mr: 2,
              }}
            >
              {item.cover ?? item.tags?.[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.title}
            sx={{
              wordBreak: 'break-word',
              mt: 0,
              mb: 0,
            }}
            secondary={
              <>
                <Typography
                  sx={{
                    display: 'inline',
                  }}
                  component="span"
                  variant="body2"
                  color="#9C27B0"
                >
                  {item.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      component="span"
                      variant="outlined"
                      sx={{
                        mr: 1,
                        fontSize: '10px',
                      }}
                      label={tag}
                      size="small"
                    />
                  ))}
                </Typography>
                {item.desc + '......'}
              </>
            }
          />
        </ListItemButton>
      ))}
    </List>
  )
}

export default ArticleList