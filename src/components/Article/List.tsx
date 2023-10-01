import { Avatar } from '@mui/material'
import type { FC } from 'react'
import Tag from '../Tag'

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
        <a
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px',
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          }}
          href={'/post/' + item.id}
        >
          <Avatar
            sx={{
              bgcolor: '#9C27B0',
              width: 52,
              height: 52,
              mr: 2,
            }}
          >
            {item.cover ?? item.tags?.[0]}
          </Avatar>
          <span>
            <span
              style={{
                lineHeight: '1.5',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              {item.title}
            </span>
            <span
              style={{
                wordBreak: 'break-word',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span>
                {item.tags?.map((tag) => <Tag key={tag} outlined text={tag} />)}
                <span
                  style={{
                    fontSize: '14px',
                    letterSpacing: '0.75px',
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {item.desc + '......'}
                </span>
              </span>
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}

export default ArticleList
