import type { FC } from 'react'
import Tag from '../ui/Tag'
import Link from 'next/link'
import ArticleCover from './Cover'
import './List.css'

interface Props {
  list: FullFrontMatter[]
}

const ArticleList: FC<Props> = ({ list }) => {
  return (
    <div className="Article-List">
      {list.map((item) => (
        <Link
          className="hover-style Article-List-Link"
          key={item.id}
          href={'/post/' + item.id}
        >
          <ArticleCover>{item.cover ?? item.tags?.[0]}</ArticleCover>
          <div
            style={{
              flex: 1,
            }}
          >
            <span className="Article-List-Title">{item.title}</span>
            <div className="Article-List-Desc-Wrap">
              <div>
                {item.tags?.map((tag) => <Tag key={tag} outlined text={tag} />)}
                <span className="Article-List-Desc">
                  {item.desc + '......'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ArticleList
