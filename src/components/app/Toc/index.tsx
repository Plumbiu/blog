import './index.css'
import type { FC } from 'react'
import TocList from './List'

interface Props {
  tocs: Toc[]
}

const TocCmp: FC<Props> = ({ tocs }) => {
  return (
    <div className="Toc-Wrap">
      {tocs.length > 0 ? (
        <div className="Toc">
          <TocList tocs={tocs} />
        </div>
      ) : undefined}
    </div>
  )
}

export default TocCmp
