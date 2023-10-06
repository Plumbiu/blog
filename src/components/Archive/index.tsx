import type { FC } from 'react'
import './index.css'
import Hr from '../ui/Hr'
import Link from 'next/link'
import { formatTime } from '@/lib/time'

interface Props {
  archives: Archeve[]
}

const ArchiveCmp: FC<Props> = ({ archives }) => {
  return (
    <div className="Archive">
      {archives.map(({ year, articles }) => (
        <div>
          <h2>{year}</h2>
          <Hr />
          <div className="Archive-Title-Wrap">
            {articles.map(({ id, title, date }) => (
              <div key={id} className="Archive-Title">
                <div></div>
                <p>{formatTime(date).split(' ')[0].slice(5)}</p>
                <Link href={'/post/' + title}>{title}</Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArchiveCmp
