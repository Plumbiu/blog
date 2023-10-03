import type { FC } from 'react'
import Link from 'next/link'
import './index.css'
import Cover from '@/components/ui/Cover'
import Tag from '../../Tag'

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
          <Cover>{item.cover ?? item.tags?.[0]}</Cover>
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
