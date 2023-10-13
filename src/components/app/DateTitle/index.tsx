import Link from 'next/link'
import type { FC } from 'react'
import { perfixTime } from '@/lib/time'
import './index.css'

interface Props {
  articles: IFrontMatter[]
  color?: string
}

const DateTitle: FC<Props> = ({ articles, color }) => {
  return (
    <div className="Date-Title">
      {articles.map(({ id, title, date }) => (
        <div key={id}>
          <p>{perfixTime(date).slice(5)}</p>
          <Link
            style={{
              color,
            }}
            href={'/post/' + id}
          >
            {title}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default DateTitle
