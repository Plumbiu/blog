import { Link } from 'next-view-transitions'
import styles from './List.module.css'
import { DESC_MAX_LEN } from '@/app/list/[...slug]/constants'
import { localeMap } from '~/config/locale'
import type { PostList } from '~/markdown/types'
import Tag from '@/components/Tag'
import { CalendarIcon } from '@/components/Icons'

function formatTime(time: string | number) {
  const d = new Date(time)
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const date = d.getDate()
  return `${year}年${String(month).padStart(2, ' 0')}月${String(date).padStart(
    2,
    '0',
  )}日`
}

function ArtList({ lists }: { lists: [string, PostList[]][] }) {
  return lists.map(([year, post]) => (
    <section key={year}>
      {post.map(({ meta, path, locale, tags }) => {
        const { title, date, desc } = meta
        return (
          <Link key={path} href={'/' + path} className={styles.link}>
            <div className={styles.title}>
              {title}
              {!!locale && (
                <div className={styles.locale}>
                  {localeMap[locale] ?? locale}
                </div>
              )}
            </div>
            <div className={styles.date}>
              <CalendarIcon />
              {formatTime(date)}
            </div>
            <div className={styles.desc}>
              {desc && desc.length > DESC_MAX_LEN
                ? desc.slice(0, DESC_MAX_LEN - 3).trim() + '...'
                : desc}
            </div>
            <div>
              {tags.map((tag) => (
                <Tag key={tag} icon="">
                  {tag}
                </Tag>
              ))}
            </div>
          </Link>
        )
      })}
    </section>
  ))
}

export default ArtList
