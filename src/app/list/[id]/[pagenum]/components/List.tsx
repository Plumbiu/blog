import { Link } from 'next-view-transitions'
import { PostList } from '@/utils/node'
import { TimeWordInfo } from '@/components/PostInfo'
import Tag from '@/components/Tag'
import styles from './List.module.css'

const MAX_LEN = 135

function ArtList({ lists }: { lists: [string, PostList[]][] }) {
  return (
    <div>
      {lists.map(([year, post]) => (
        <div key={year}>
          <div className={styles.year}>{year}</div>
          {post.map(
            ({ title, date, desc, subtitle, tags, wordLength, path }) => (
              <Link
                key={path}
                prefetch
                href={'/' + path}
                className={styles.link}
              >
                <div className={styles.title}>{title}</div>
                <TimeWordInfo wordLength={wordLength} date={date} />
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                <div className={styles.desc}>
                  {desc.length > MAX_LEN
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
            ),
          )}
        </div>
      ))}
    </div>
  )
}

export default ArtList
