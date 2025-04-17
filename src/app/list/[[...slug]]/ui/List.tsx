import { Link } from 'next-view-transitions'
import styles from './List.module.css'
import { DESC_MAX_LEN } from '../constants'
import { localeMap } from '~/config/locale'
import type { PostList } from '~/markdown/types'
import PostMeta from '@/components/PostMeta'

function ArtList({ lists }: { lists: [string, PostList[]][] }) {
  return lists.map(([_year, post]) =>
    post.map((postProps) => {
      const { meta, path, locale } = postProps
      const { title, desc } = meta
      return (
        <div key={path} className={styles.list}>
          <Link href={'/' + path} className={styles.title}>
            {title}
            {!!locale && (
              <div className={styles.locale}>{localeMap[locale] ?? locale}</div>
            )}
          </Link>
          <PostMeta {...postProps} />
          <div className={styles.desc}>
            {desc && desc.length > DESC_MAX_LEN
              ? desc.slice(0, DESC_MAX_LEN - 3).trim() + '...'
              : desc}
          </div>
          <div className={styles.bottom}>
            <div>{meta.wordLength} words</div> <div className="verticalLine" />
            <div>{(meta.wordLength / 225).toFixed(0)} minutes</div>
          </div>
        </div>
      )
    }),
  )
}

export default ArtList
