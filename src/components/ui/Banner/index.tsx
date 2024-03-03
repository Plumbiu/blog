import type { FC, ReactNode } from 'react'
import Link from 'next/link'
import './index.css'
// import Image from 'next/image'
import { perfixTime } from '@/lib/time'
import { ClockIcon, UpdateClockIcon } from '@/components/icons'

interface Props {
  children?: ReactNode
  posts: IFrontMatter[]
  name: string
}

const ArticleBanner: FC<Props> = ({ posts, name, children }) => {
  name = decodeURI(name)

  return (
    <div className="Banner">
      {posts.map(({ id, desc, title, tags, categories, date, updated }) => (
        <Link className="Hover-Border" key={id} href={'/post/' + id}>
          <div className="Banner-List">
            <div className="Banner-Title">{title}</div>
            <div className="Banner-Date">
              <ClockIcon />
              <p>{perfixTime(date)}</p>
              <UpdateClockIcon />
              <p>{perfixTime(updated)}</p>
            </div>
            <div className="Banner-Desc">{desc}......</div>
            <div className="Banner-Tag">
              {categories.map((category) => (
                <div key={category} className="Banner-Tag-Plain">
                  {category}
                </div>
              ))}
              {tags.map((tag) => (
                <div key={tag} className="Banner-Tag-Fill">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </Link>
      ))}
      {children}
    </div>
  )
}

export default ArticleBanner
