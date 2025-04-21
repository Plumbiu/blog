import { cn } from '@/lib/client'
import { CalendarIcon, BookmarkIcon, TagIcon } from '../../Icons'
import styles from './index.module.css'
import type { PostList } from '~/markdown/types'

function formatTime(time: string | number) {
  const d = new Date(time)
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const date = d.getDate()
  return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(
    2,
    '0',
  )}`
}

export default function PostMeta({
  meta,
  type,
  tags,
}: Pick<PostList, 'meta' | 'type' | 'tags'>) {
  const { date } = meta
  return (
    <div className={cn('load_ani', styles.post_info)}>
      <div className="fcc">
        <CalendarIcon />
        {formatTime(date)}
      </div>
      {!!type && (
        <div className="fcc">
          <BookmarkIcon />
          {type}
        </div>
      )}
      {tags && !!tags.length && (
        <div className={cn('fcc', styles.tags)}>
          <TagIcon />
          {tags.map((tag, i) => (
            <div className="fcc" key={tag}>
              {tag}
              {i === tags.length - 1 ? null : <span className="slashLine" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
