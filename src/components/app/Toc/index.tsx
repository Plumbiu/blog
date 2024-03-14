import './index.css'
import type { FC } from 'react'
import TocList from './List'
import { html2toc } from '@/lib/md/index'

interface Props {
  html: string
}

const TocCmp: FC<Props> = ({ html }) => {
  const tocs = html2toc(html)

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
