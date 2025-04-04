import { Link } from 'next-view-transitions'
import type { PostList } from '@/utils/node/markdown'
import { TimeWordInfo } from '@/components/PostInfo'
import styles from './List.module.css'
import { DESC_MAX_LEN } from '@/app/list/constants'

function ArtList({ lists }: { lists: [string, PostList[]][] }) {
  return lists.map(([year, post]) => (
    <section key={year}>
      <div className={styles.year}>{year}</div>
      {post.map(({ meta, path }) => {
        const { title, date, desc, subtitle, tags, wordLength } = meta
        return (
          <Link key={path} href={'/' + path} className={styles.link}>
            <div className={styles.title}>{title}</div>
            <TimeWordInfo date={date} />
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
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
