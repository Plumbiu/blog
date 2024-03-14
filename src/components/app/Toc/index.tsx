import './index.css'
import type { FC } from 'react'
import Hr from '../../ui/Hr'
import TocList from './List'
import { html2toc } from '@/lib/md/index'
import { perfixTime } from '@/lib/time'
import { ClockIcon } from '@/components/icons'

interface Props {
  html: string
  title: string
  tags: string[]
  date: Date
  updated: Date
  categories: string[]
}

const TocCmp: FC<Props> = ({ html, title, tags, categories, date }) => {
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
