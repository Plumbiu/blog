import { Link } from 'next-view-transitions'
import type { PostList } from '@/utils/node/markdown'
import { TimeWordInfo } from '@/components/PostInfo'
import Tag from '@/components/Tag'
import styles from './List.module.css'

const MAX_LEN = 135

function ArtList({ lists }: { lists: [string, PostList[]][] }) {
  return lists.map(([year, post]) => (
    <section key={year}>
      <div className={styles.year}>{year}</div>
      {post.map(({ meta, path }) => {
        const { title, date, desc, subtitle, tags, wordLength } = meta
        return (
          <Link key={path} href={'/' + path} className={styles.link}>
            <div className={styles.title}>{title}</div>
            <TimeWordInfo wordLength={wordLength} date={date} />
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            <div className={styles.desc}>
              {desc && desc.length > MAX_LEN
                ? desc.slice(0, MAX_LEN - 3) + '...'
                : desc}
            </div>
            {tags && (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <Tag key={tag} icon="#">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </Link>
        )
      })}
    </section>
  ))
}

export default ArtList
