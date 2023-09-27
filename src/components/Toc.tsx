import { genTocs } from '@/lib/toc'
import { Chip, Typography } from '@mui/material'
import type { FC } from 'react'
import Side from './ui/Side'
import BackToArticle from './ui/BackToArticle'
import Hr from './ui/Hr'

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
          padding: '16px 4px',
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
            <Chip color="primary" label={tag} size="small" />
          ))}
        </Typography>
        <Hr />
        {tocs.map(({ level, id }) => (
          <div
            key={id}
            style={{
              margin: '8px 0',
            }}
          >
            <Typography
              component="a"
              gutterBottom
              variant="body2"
              href={'#' + id.replace(/\s/g, '')}
              sx={{
                pl: level * 1.5,
              }}
            >
              {id}
            </Typography>
          </div>
        ))}
        <Hr />
        <BackToArticle />
      </div>
    </Side>
  )
}

export default Toc
