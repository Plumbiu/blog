import { type FC } from 'react'
import Link from 'next/link'
import './index.css'
import dayjs from 'dayjs'
import { perfixTime } from '@/lib/time'

interface Props {
  posts: IFrontMatter[]
  name: string
}

const ArtList: FC<Props> = ({ posts, name }) => {
  name = decodeURI(name)
  const formatedPosts: Record<string, IFrontMatter[]> = {}
  for (const { id, tags, categories, date, ...rest } of posts) {
    const key = perfixTime(date).split('-')[0]
    if (!formatedPosts[key]) {
      formatedPosts[key] = []
    }
    formatedPosts[key].push({
      id,
      tags,
      categories,
      date,
      ...rest,
    })
  }
  const usedPosts = Object.entries(formatedPosts).sort((a, b) => +b[0] - +a[0])

  return (
    <div className="ArtList">
      {usedPosts.map(([year, posts]) => (
        <div key={year} data-year={year} className="ArtList-Year">
          {posts.map(({ id, title, tags, categories, date, readTime }) => (
            <Link
              target="__blank"
              className="ArtList-Link"
              key={id}
              href={'/post/' + id}
            >
              <div className="ArtList-Top">
                <div className="ArtList-Title">{title}</div>
                <div className="ArtList-Date">
                  {dayjs(perfixTime(date)).format('MMM DD · dddd')} · {readTime}
                  min
                </div>
              </div>
              <div className="ArtList-Bottom">
                <div className="ArtList-Tag">
                  {categories.map((category) => (
                    <div key={category}>{category}</div>
                  ))}
                  {tags.map((tag) => (
                    <div key={tag}>{tag}</div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ArtList
