import type { FC } from 'react'
import './index.css'
import Hr from '../../ui/Hr'
import ArchiveList from './List'

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
          <ArchiveList articles={articles} />
        </div>
      ))}
    </div>
  )
}

export default ArchiveCmp