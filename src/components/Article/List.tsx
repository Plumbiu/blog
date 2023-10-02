import type { FC } from 'react'
import Tag from '../ui/Tag'
import Link from 'next/link'
import ArticleCover from './Cover'

interface Props {
  list: FullFrontMatter[]
}

const ArticleList: FC<Props> = ({ list }) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '12px 0',
      }}
    >
      {list.map((item) => (
        <Link
          className="hover-style"
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px',
          }}
          href={'/post/' + item.id}
        >
          <ArticleCover>{item.cover ?? item.tags?.[0]}</ArticleCover>
          <div>
            <span
              style={{
                lineHeight: '1.5',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              {item.title}
            </span>
            <div
              style={{
                wordBreak: 'break-word',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div>
                {item.tags?.map((tag) => <Tag key={tag} outlined text={tag} />)}
                <span
                  style={{
                    fontSize: '14px',
                    letterSpacing: '0.75px',
                    color: 'rgba(0, 0, 0, 0.6)',
                    lineHeight: 1.8,
                  }}
                >
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
