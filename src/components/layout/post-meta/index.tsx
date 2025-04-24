import { cn } from '@/lib/client'
import { CalendarIcon, BookmarkIcon, TagIcon } from '../../Icons'
import styles from './index.module.css'
import type { PostList } from '~/markdown/types'
import Link from 'next/link'
import { upperFirstChar } from '@/lib/shared'
import { Fragment } from 'react'

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
}: Pick<PostList, 'meta' | 'type' | 'tags'> & {
  meta: {
    date: number
  }
}) {
  const { date } = meta
  return (
    <div className={cn('load_ani', styles.wrap)}>
      <div className={'fcc'}>
        <CalendarIcon />
        <div className={cn('-ml-4', styles.card)}>{formatTime(date)}</div>
      </div>
      {!!type && (
        <Link href={`/category/${type}`} className={'fcc'}>
          <BookmarkIcon />
          <div className={cn('fcc', '-ml-4', styles.link_card, styles.card)}>
            {upperFirstChar(type)}
          </div>
        </Link>
      )}
      {tags && !!tags.length && (
        <div className={cn('fcc', styles.tag)}>
          <TagIcon />
          {tags.map((tag, i) => (
            <Fragment key={tag}>
              {i !== 0 && <div className="slashLine" />}
              <Link
                className={cn('fcc', styles.link_card, styles.card)}
                key={tag}
                href={`/tag/${tag}`}
              >
                {tag}
              </Link>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
