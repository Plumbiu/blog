import '@/styles/toc.css'
import { genTocs } from '@/lib/toc'
import type { FC } from 'react'
import Side from '../ui/Side'
import TocList from './List'
import { formatTime } from '@/lib/time'
import { AccessTimeFilled } from '@mui/icons-material'
import Tag from '../Tag'

interface Props {
  html: string
  title: string
  tags: string[]
  date: Date
  updated: Date
  categories: string[]
}

const Toc: FC<Props> = ({ html, title, tags, categories, date }) => {
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
            padding: '6px 16px',
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
              padding: '4px 0',
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
          {categories?.map((category) => (
            <Tag outlined key={category} text={category} />
          ))}
          {tags?.map((tag) => <Tag key={tag} text={tag} filled />)}
        </div>
        <TocList tocs={tocs} />
      </div>
    </Side>
  )
}

export default Toc
