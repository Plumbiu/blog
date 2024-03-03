import './index.css'
import type { FC } from 'react'
import { html2toc } from '@plumbiu/md'
import ButtonIcon from '../../ui/Button/Icon'
import Tag from '../../ui/Tag'
import Hr from '../../ui/Hr'
import TocList from './List'
import { perfixTime } from '@/lib/time'
import { ArrowBackIcon, ClockIcon } from '@/components/icons'

interface Props {
  html: string
  title: string
  tags: string[]
  date: Date
  updated: Date
  categories: string[]
}

const TocCmp: FC<Props> = async ({ html, title, tags, categories, date }) => {
  const tocs = html2toc(html)

  return (
    <div className="Toc-Wrap">
      <div className="Toc">
        <h4>{title}</h4>
        <div className="Toc-Date">
          <ClockIcon
            style={{
              fontSize: '13px',
              color: '#1976D2',
              marginRight: '4px',
            }}
          />
          <p>{perfixTime(date)}</p>
        </div>
        <div className="Toc-Tags">
          {categories?.map((category) => (
            <Tag key={category} text={category} />
          ))}
          {tags?.map((tag) => (
            <Tag key={tag} text={tag} filled />
          ))}
        </div>
        <Hr />
        <TocList tocs={tocs} />
        <Hr />
        <div className="Toc-Bottom">
          <ButtonIcon link="/article" text="文章页" icon={<ArrowBackIcon />} />
        </div>
      </div>
    </div>
  )
}

export default TocCmp
