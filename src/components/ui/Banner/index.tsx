import { Fragment, type FC, type ReactNode } from 'react'
import Link from 'next/link'
import './index.css'
// import Image from 'next/image'
import ButtonBg from '../Button/Bg'
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
      {posts.map(({ id, desc, title, tags, categories, date }) => (
        <div className="Banner-Inner">
          <Link className="Banner-Link" key={id} href={'/post/' + id}>
            <div className="Banner-List">
              <div className="Banner-Title">{title}</div>
              <div className="Banner-Date">
                <ClockIcon />
                <p>{perfixTime(date)}</p>
                <div className="Banner-Tag">
                  {categories.map((category) => (
                    <div key={category} className="Banner-Tag-Plain">
                      {category}
                    </div>
                  ))}
                  {tags.map((tag) => (
                    <div key={tag} className="Banner-Tag-Plain">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
          <div
            className="Banner-Desc md"
            dangerouslySetInnerHTML={{
              __html: desc + '\n\n.......',
            }}
          />
          <Link className="Banner-Link-ReadMore" href={'/post/' + id}>
            Read More
          </Link>
        </div>
      ))}
      {children}
    </div>
  )
}

export default ArticleBanner
