import type { FC } from 'react'
import { formatTime } from '@/lib/time'
import Link from 'next/link'
import React from 'react'
import { ArrowBack } from '@mui/icons-material'
import './index.css'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'

interface Props {
  posts: FullFrontMatter[]
  name: string
  path: string
}

const ArticleBanner: FC<Props> = ({ posts, name, path }) => {
  name = decodeURI(name)
  return (
    <div>
      <div className="Banner-Title-Wrap">
        <div className="Banner-Title-Stack">
          <Badge count={posts.length}>
            <Tag link={`/${path}/${name}`} text={name} plain />
          </Badge>
        </div>
      </div>
      <div className="Banner-List">
        {posts.map(({ id, desc, title, updated, date, tags, categories }) => (
          <Link
            key={id}
            className="hover-a-style Banner-List-Link"
            href={'/post/' + id}
          >
            <div className="Banner-List-Link-Top">
              <span className="Banner-List-Link-Title">{title}</span>
              <div>
                <Tag text={formatTime(date).split(' ')[0].slice(2)} outlined />
                <Tag text={formatTime(updated).split(' ')[0].slice(2)} />
              </div>
            </div>
            <div className="Banner-List-Link-Desc">{desc}...</div>
            <div>
              {categories.map((category) => (
                <Tag key={category} text={category} outlined />
              ))}
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </Link>
        ))}
        <div className="hover-btn-icon-style Banner-List-Btn">
          <ArrowBack fontSize="small" />
          <Link href="/tags">标签页</Link>
        </div>
      </div>
    </div>
  )
}

export default ArticleBanner
