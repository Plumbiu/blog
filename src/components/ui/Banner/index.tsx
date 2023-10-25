import type { FC } from 'react'
import Link from 'next/link'
import './index.css'
import Image from 'next/image'
import Tag from '@/components/ui/Tag'
import { perfixTime } from '@/lib/time'
import { ClockIcon } from '@/components/icons'

interface Props {
  posts: IFrontMatter[]
  name: string
}

const imageMap: Record<string, string> = {
  vue: 'vue.svg',
  rollup: 'rollup.svg',
}

function toImage(tag: string) {
  const key = Object.keys(imageMap).find((item) =>
    item.includes(tag.toLocaleLowerCase()),
  )
  if (!key) return key

  return imageMap[key]
}

const ArticleBanner: FC<Props> = ({ posts, name }) => {
  name = decodeURI(name)

  return (
    <div className="Banner">
      {posts.map(({ id, desc, title, tags, categories, date }) => (
        <Link key={id} className="Hover" href={'/post/' + id}>
          {toImage(tags[0]) && (
            <div className="Banner-Cover">
              <Image
                width={64}
                height={64}
                alt={tags[0]}
                src={'/cover/' + toImage(tags[0])}
              />
            </div>
          )}
          <div className="Banner-List">
            <div className="Banner-Title">{title}</div>
            <div className="Banner-Date">
              <ClockIcon />
              <p>{perfixTime(date)}</p>
            </div>
            <div className="Banner-Desc">{desc}...</div>
            <div>
              {categories.map((category) => (
                <Tag key={category} text={category} outlined />
              ))}
              {tags.map((tag) => (
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
