import type { FC } from 'react'
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
      {posts.map(({ id, desc, title, tags, categories }) => (
        <Link key={id} className="hover-a-style Banner-Link" href={'/post/' + id}>
          <div className="Banner-Link-Title">{title}</div>
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
