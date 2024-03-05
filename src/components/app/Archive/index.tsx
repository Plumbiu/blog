import type { FC } from 'react'
import Hr from '../../ui/Hr'
import ArchiveList from './List'

interface Props {
  archives: IArcheve[]
}

const ArchiveCmp: FC<Props> = ({ archives }) => {
  return (
    <div className="Archive">
      {archives.map(({ year, articles }) => (
        <div key={year}>
          <h2>{year}</h2>
          <Hr />
          <ArchiveList articles={articles} />
        </div>
      ))}
    </div>
  )
}

export default ArchiveCmp
