import '@/styles/toc.css'
import { genTocs } from '@/lib/toc'
import { Chip } from '@mui/material'
import type { FC } from 'react'
import Side from '../ui/Side'
import TocList from './List'
import { formatTime } from '@/lib/time'
import { AccessTimeFilled } from '@mui/icons-material'

interface Props {
  id: string
  html: string
  title: string
  tags: string[]
  date: Date
  updated: Date
  categories: string[]
}

const Toc: FC<Props> = ({ html, title, tags, categories, id, date }) => {
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
        <h3
          style={{
            paddingLeft: '16px',
          }}
        >
          {title}
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
          }}
        >
          <AccessTimeFilled
            sx={{
              fontSize: '14px',
              color: '#1976D2',
              mr: '4px',
            }}
          />
          <p
            style={{
              fontSize: '14px',
            }}
          >
            {formatedDate.split(' ')[0]}
          </p>
        </div>
        <div
          style={{
            paddingLeft: '14px',
            paddingBottom: '12px',
          }}
        >
          {categories?.map((tag) => (
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
          {tags?.map((tag) => (
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
        </div>
        <TocList tocs={tocs} id={id} />
      </div>
    </Side>
  )
}

export default Toc
