import { Link } from 'next-view-transitions'
import type { PostList } from '@/lib/node/markdown'
import { TimeWordInfo } from '@/components/PostInfo'
import styles from './List.module.css'
import { DESC_MAX_LEN } from '@/app/list/constants'

const localeMap: Record<string, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
}

function ArtList({ lists }: { lists: [string, PostList[]][] }) {
  return lists.map(([year, post]) => (
    <section key={year}>
      <div className={styles.year}>{year}</div>
      {post.map(({ meta, path, locale }) => {
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
            <TimeWordInfo date={date} />
            <div className={styles.desc}>
              {desc && desc.length > DESC_MAX_LEN
                ? desc.slice(0, DESC_MAX_LEN - 3).trim() + '...'
                : desc}
            </div>
          </Link>
        )
      })}
    </section>
  ))
}

export default ArtList
