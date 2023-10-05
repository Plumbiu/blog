import type { FC } from 'react'
import Link from 'next/link'
import React from 'react'
import './index.css'
import Tag from '@/components/ui/Tag'
import { AccessTimeFilled } from '@mui/icons-material'
import { formatTime } from '@/lib/time'

interface Props {
  posts: FullFrontMatter[]
  name: string
  path: string
}

const ArticleBanner: FC<Props> = ({ posts, name, path }) => {
  name = decodeURI(name)
  return (
    <div className="Banner-Wrap">
      {posts.map(({ id, desc, title, tags, categories, date }) => (
        <Link key={id} className="hover-a-style Banner-Link" href={'/post/' + id}>
          <div className="Banner-Link-Title">{title}</div>
          <div className="Banner-Date">
            <AccessTimeFilled
              sx={{
                fontSize: '14px',
                color: '#1976D2',
                mr: '4px',
              }}
            />
            <p>{formatTime(date).split(' ')[0]}</p>
          </div>
          <div className="Banner-Link-Desc">{desc}...</div>
          <div>
            {categories.map(category => (
              <Tag key={category} text={category} outlined />
            ))}
            {tags.map(tag => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ArticleBanner
