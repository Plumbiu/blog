import styles from './List.module.css'
import { DESC_MAX_LEN } from '../constants'
import { localeMap } from '~/config/locale'
import type { PostList } from '~/markdown/types'
import PostMeta from '@/components/layout/post-meta'
import { cn } from '@/lib/client'
import Title from '@/components/ui/Title'

function ArtList({ posts }: { posts: PostList[] }) {
  return posts.map((post) => {
    const { meta, path, locale } = post
    const { title, desc } = meta
    return (
      <div key={path} className={cn('load_ani', styles.list)}>
        <Title href={'/' + path} className={styles.title} scroll>
          {title}
          {!!locale && (
            <div className={styles.locale}>{localeMap[locale] ?? locale}</div>
          )}
        </Title>
        <PostMeta {...post} />
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
  })
}

export default ArtList
