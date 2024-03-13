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
      <div className="Toc">
        <div className="Toc-Title">{title}</div>
        <div className="Toc-Date">
          <ClockIcon
            style={{
              fontSize: '14px',
              color: '#1976D2',
              marginRight: '4px',
            }}
          />
          <p>{perfixTime(date)}</p>
        </div>
        <Hr />
        <TocList tocs={tocs} />
      </div>
    </div>
  )
}

export default TocCmp
