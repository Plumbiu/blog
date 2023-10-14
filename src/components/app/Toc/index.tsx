import './index.css'
import type { FC } from 'react'
import { html2toc } from '@plumbiu/md'
import ButtonIcon from '../../ui/Button/Icon'
import Tag from '../../ui/Tag'
import Hr from '../../ui/Hr'
import DateTitle from '../DateTitle'
import TocList from './List'
import { perfixTime } from '@/lib/time'
import { ArrowBackIcon, ClockIcon } from '@/components/icons'
import { useGet } from '@/lib/api'

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
  const relatedArticles = await useGet<IFrontMatter[]>(
    'article?limit=3&tag=' + tags[0],
  )

  return (
    <div className="Side-Left">
      <div className="Toc">
        <h2>{title}</h2>
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
        <div className="Toc-Tags">
          {categories?.map(category => (
            <Tag
              key={category}
              link={'/category/' + category}
              outlined
              text={category}
            />
          ))}
          {tags?.map(tag => (
            <Tag key={tag} link={'/tag/' + tag} text={tag} />
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

export default TocCmp
