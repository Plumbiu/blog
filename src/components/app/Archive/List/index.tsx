import type { FC } from 'react'
import Link from 'next/link'
import { perfixTime } from '@/lib/time'
import './index.css'

interface Props {
  articles: IFrontMatter[]
}

const ArchiveList: FC<Props> = ({ articles }) => {
  return (
    <div className="Archive-Title">
      {articles.map(({ id, title, date }) => (
        <div key={id}>
          <div />
          <p>{perfixTime(date).slice(5)}</p>
          <Link href={'/post/' + id}>{title}</Link>
        </div>
      ))}
    </div>
  )
}

export default ArchiveList
