import type { FC } from 'react'
import Tag from '@/components/ui/Tag'
import { formatTime } from '@/lib/time'
import Link from 'next/link'
import React from 'react'
import { ArrowBack } from '@mui/icons-material'
import './List.css'

interface Props {
  posts: FullFrontMatter[]
}

const TagsList: FC<Props> = ({ posts }) => {
  return (
    <div className="Tags-List">
      {posts.map(({ id, desc, title, updated, date, tags, categories }) => (
        <Link
          key={id}
          className="hover-a-style Tags-List-Link"
          href={'/post/' + id}
        >
          <div className="Tags-List-Link-Top">
            <span className="Tags-List-Link-Title">{title}</span>
            {categories.map((category) => (
              <Tag key={category} text={category} outlined />
            ))}
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
          <div
            className="Tags-List-Link-Desc"
            style={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.6)',
              padding: '16px 36px 24px 0',
            }}
          >
            {desc}......
          </div>
          <div>
            <Tag text={formatTime(date).split(' ')[0]} outlined />
            <Tag text={formatTime(updated).split(' ')[0]} />
          </div>
        </Link>
      ))}
      <div className="hover-btn-icon-style Tags-List-Btn">
        <ArrowBack fontSize="small" />
        <Link href="/tags">标签页</Link>
      </div>
    </div>
  )
}

export default TagsList
