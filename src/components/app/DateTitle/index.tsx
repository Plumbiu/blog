import { formatTime } from '@/lib/time'
import Link from 'next/link'
import type { FC } from 'react'
import './index.css'

interface Props {
  articles: FullFrontMatter[]
  color?: string
}

const DateTitle: FC<Props> = ({ articles, color }) => {
  return (
    <div className="Date-Title">
      {articles.map(({ id, title, date }) => (
        <div key={id}>
          <p>{formatTime(date).split(' ')[0].slice(5)}</p>
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
