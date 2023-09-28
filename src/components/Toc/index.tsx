import '@/styles/toc.css'
import { genTocs } from '@/lib/toc'
import { Chip, ListItemText, Typography } from '@mui/material'
import type { FC } from 'react'
import Side from '../ui/Side'
import TocList from './List'
import { formatTime } from '@/lib/time'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'

interface Props {
  id: string
  html: string
  title: string
  tags: string[]
  date: Date
  updated: Date
  categories: string[]
}

const Toc: FC<Props> = ({
  html,
  title,
  tags,
  categories,
  id,
  date,
  updated,
}) => {
  const tocs = genTocs(html)
  const formatedDate = formatTime(date)
  return (
    <Side>
      <div
        style={{
          backgroundColor: '#fff',
          padding: '16px 0px',
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            px: '16px',
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '16px',
            marginTop: '2px',
          }}
        >
          <AccessTimeFilledIcon
            sx={{
              fontSize: '14px',
              color: '#1976D2',
              mr: '6px',
              my: '8px',
            }}
          />
          <ListItemText
            sx={{ my: 0 }}
            primary={formatedDate.split(' ')[0]}
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: 'medium',
              letterSpacing: 0,
            }}
          />
        </div>
        <Typography
          gutterBottom
          component="div"
          sx={{
            pl: '14px',
          }}
        >
          {categories.map((tag) => (
            <Chip
              variant="outlined"
              color="primary"
              sx={{
                mt: 1,
                mr: 1,
              }}
              label={tag}
              size="small"
            />
          ))}
          {tags.map((tag) => (
            <Chip
              color="primary"
              sx={{
                mt: 1,
                mr: 1,
              }}
              label={tag}
              size="small"
            />
          ))}
        </Typography>
        <TocList tocs={tocs} id={id} />
      </div>
    </Side>
  )
}

export default Toc
