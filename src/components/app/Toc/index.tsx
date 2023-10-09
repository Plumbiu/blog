import './index.css'
import { genTocs } from '@/lib/toc'
import type { FC } from 'react'
import TocList from './List'
import { formatTime } from '@/lib/time'
import ButtonIcon from '../../ui/Button/Icon'
import Tag from '../../ui/Tag'
import Hr from '../../ui/Hr'
import { ArrowBackIcon, ClockIcon } from '@/components/icons'
import { useGet } from '@/lib/api'
import DateTitle from '../DateTitle'

interface Props {
  html: string
  title: string
  tags: string[]
  date: Date
  updated: Date
  categories: string[]
}

const Toc: FC<Props> = async ({ html, title, tags, categories, date }) => {
  const tocs = genTocs(html)
  const formatedDate = formatTime(date)
  const relatedArticles = await useGet<IFullFrontMatter[]>('article?limit=3&tag=' + tags[0])
  return (
    <div className="Side-Left">
      <div className="Toc">
        <h3>{title}</h3>
        <div className="Toc-Date">
          <ClockIcon
            style={{
              fontSize: '14px',
              color: '#1976D2',
              marginRight: '4px',
            }}
          />
          <p>{formatedDate.split(' ')[0]}</p>
        </div>
        <div className="Toc-Tags">
          {categories?.map(category => (
            <Tag key={category} link={'/categories/' + category} outlined text={category} />
          ))}
          {tags?.map(tag => (
            <Tag key={tag} link={'/tags/' + tag} text={tag} />
          ))}
        </div>
        <Hr />
        <TocList tocs={tocs} />
        <Hr />
        <div className="Toc-Bottom">
          <ButtonIcon
            link="/article"
            text="文章页"
            icon={
              <ArrowBackIcon
                style={{
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              />
            }
          />
        </div>
      </div>
      <div className="Toc">
        <h3>相关文章</h3>
        <DateTitle articles={relatedArticles} color="#1976D2" />
      </div>
    </div>
  )
}

export default Toc
