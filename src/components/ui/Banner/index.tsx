import { type FC } from 'react'
import Link from 'next/link'
import './index.css'
import dayjs from 'dayjs'
import { perfixTime } from '@/lib/time'

interface Props {
  posts: IFrontMatter[]
  name: string
}

const ArticleBanner: FC<Props> = ({ posts, name }) => {
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
    <div className="Banner">
      {usedPosts.map(([year, posts]) => (
        <div data-year={year} className="Banner-Year">
          {posts.map(({ id, title, tags, categories, date }) => (
            <Link
              target="__blank"
              className="Banner-Link"
              key={id}
              href={'/post/' + id}
            >
              <div>
                <div className="Banner-Top">
                  <div className="Banner-Title">{title}</div>
                  <div className="Banner-Date">
                    {dayjs(perfixTime(date)).format('MMM DD · ddd')}
                  </div>
                </div>
                <div className="Banner-Bottom">
                  <div className="Banner-Tag">
                    {categories.map((category) => (
                      <div key={category}>{category}</div>
                    ))}
                    {tags.map((tag) => (
                      <div key={tag}>{tag}</div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ArticleBanner
