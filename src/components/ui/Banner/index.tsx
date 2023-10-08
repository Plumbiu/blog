import type { FC } from 'react'
import Link from 'next/link'
import React from 'react'
import './index.css'
import Tag from '@/components/ui/Tag'
import { formatTime } from '@/lib/time'
import Image from 'next/image'
import { ClockIcon } from '@/components/icons'

interface Props {
  posts: FullFrontMatter[]
  name: string
  col?: 1 | 2
}

const imageMap: Record<string, string> = {
  vue: 'vue.svg',
  rollup: 'rollup.svg',
}

function toImage(tag: string) {
  const key = Object.keys(imageMap).find(item => item.includes(tag.toLocaleLowerCase()))
  if (!key) return key
  return imageMap[key]
}

const ArticleBanner: FC<Props> = ({ posts, name, col = 1 }) => {
  name = decodeURI(name)
  return (
    <div className="Banner-Wrap">
      {posts.map(({ id, desc, title, tags, categories, date }) => (
        <Link key={id} className={`Hover-Dark Banner-Link Banner-Col-${col}`} href={'/post/' + id}>
          {toImage(tags[0]) && (
            <div className="Banner-Cover">
              <Image width={70} height={70} alt={tags[0]} src={'/cover/' + toImage(tags[0])} />
            </div>
          )}
          <div className="Banner-List">
            <div className="Banner-Link-Title">{title}</div>
            <div className="Banner-Date">
              <ClockIcon />
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
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ArticleBanner
