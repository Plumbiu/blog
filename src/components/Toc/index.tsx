import '@/styles/toc.css'
import { genTocs } from '@/lib/toc'
import { Chip, Typography } from '@mui/material'
import type { FC } from 'react'
import Side from '../ui/Side'
import BackToArticle from '../ui/BackToArticle'
import Hr from '../ui/Hr'
import TocList from './List'

interface Props {
  html: string
  title: string
  tags: string[]
}

const Toc: FC<Props> = ({ html, title, tags }) => {
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
        <Hr />
        <div
          style={{
            maxHeight: '460px',
            overflowY: 'scroll',
          }}
        >
          <TocList tocs={tocs} />
        </div>
        <Hr />
        <BackToArticle />
      </div>
    </Side>
  )
}

export default Toc
