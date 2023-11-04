import type { FC, ReactNode } from 'react'
import Link from 'next/link'
import './index.css'
// import Image from 'next/image'
import { perfixTime } from '@/lib/time'
import { ClockIcon } from '@/components/icons'

interface Props {
  children?: ReactNode
  posts: IFrontMatter[]
  name: string
}

// function toImage(tag: string) {
//   const key = Object.keys(imageMap).find((item) =>
//     item.includes(tag.toLocaleLowerCase()),
//   )
//   if (!key) return key

//   return imageMap[key]
// }

const ArticleBanner: FC<Props> = ({ posts, name, children }) => {
  name = decodeURI(name)

  return (
    <div className="Banner">
      {posts.map(({ id, desc, title, tags, categories, date }) => (
        <Link key={id} href={'/post/' + id}>
          {/* {toImage(tags[0]) && (
            <div className="Banner-Cover">
              <Image
                width={64}
                height={64}
                alt={tags[0]}
                src={'/cover/' + toImage(tags[0])}
              />
            </div>
          )} */}
          <div className="Banner-List">
            <div className="Banner-Title">🌟 {title}</div>
            <div className="Banner-Date">
              <ClockIcon />
              <p>{perfixTime(date)}</p>
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
