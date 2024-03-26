import './index.css'
import type { FC } from 'react'
import TocList from './List'

interface Props {
  tocs: Toc[]
}

const TocCmp: FC<Props> = ({ tocs }) => {
  return (
    <div className="Toc-Wrap">
      <div className="Toc">
        <TocList tocs={tocs} />
      </div>
    </div>
  )
}

export default TocCmp
