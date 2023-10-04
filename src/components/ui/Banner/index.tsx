import type { FC } from 'react'
import { formatTime } from '@/lib/time'
import Link from 'next/link'
import React from 'react'
import './index.css'
import Tag from '@/components/ui/Tag'

interface Props {
  posts: FullFrontMatter[]
  name: string
  path: string
}

const ArticleBanner: FC<Props> = ({ posts, name, path }) => {
  name = decodeURI(name)
  return (
    <div className="Banner-Wrap">
      {posts.map(({ id, desc, title, updated, date, tags, categories }) => (
        <Link
          key={id}
          className="hover-a-style Banner-Link"
          href={'/post/' + id}
        >
          <div className="Banner-Link-Top">
            <span className="Banner-Link-Title">{title}</span>
            <div>
              <Tag text={formatTime(date).split(' ')[0].slice(2)} outlined />
              <Tag text={formatTime(updated).split(' ')[0].slice(2)} />
            </div>
          </div>
          <div className="Banner-Link-Desc">{desc}...</div>
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
    </div>
  )
}

export default ArticleBanner
