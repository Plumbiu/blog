import '@/styles/toc.css'
import { genTocs } from '@/lib/toc'
import { Chip, Typography } from '@mui/material'
import type { FC } from 'react'
import Side from '../ui/Side'
import TocList from './List'

interface Props {
  id: string
  html: string
  title: string
  tags: string[]
  categories: string[]
}

const Toc: FC<Props> = ({ html, title, tags, categories, id }) => {
  const tocs = genTocs(html)
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
          gutterBottom
          component="div"
          sx={{
            px: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          gutterBottom
          component="div"
          sx={{
            pl: 2,
          }}
        >
          {categories.map((tag) => (
            <Chip
              variant="outlined"
              color="primary"
              sx={{
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
