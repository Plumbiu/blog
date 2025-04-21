import type { PostList } from '~/markdown/types'
import styles from './Timeline.module.css'
import { cn } from '@/lib/client'
import { formatPostByYear } from '../utils'

interface TimelineProps {
  posts: PostList[]
}

function formatYear(n: number) {
  const date = new Date(n)

  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

async function TimeLine({ posts }: TimelineProps) {
  const postsWithYear = formatPostByYear(posts)

  return (
    <div className={cn(styles.wrap, 'main_content')}>
      {postsWithYear.map(([year, posts]) => {
        return (
          <section key={year}>
            <div className={cn(styles.item, styles.header_item)}>
              <div className={cn(styles.left, styles.year)}>{year}</div>
              <div className={cn('fcc', styles.date_dot)} />
              <div className={styles.count}>{posts.length} posts</div>
            </div>
            <div>
              {posts.map((post) => {
                return (
                  <div
                    key={post.path}
                    className={cn(styles.post_item, styles.item)}
                  >
                    <div className={cn(styles.left, styles.date)}>
                      {formatYear(post.meta.date)}
                    </div>
                    <div className={cn('fcc', styles.post_dot_wrap)}>
                      <div className={styles.post_dot} />
                    </div>
                    <div className={styles.post_meta}>
                      <div className={styles.post_title}>{post.meta.title}</div>
                      <div className={styles.post_tags}>
                        {post.meta.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
export default TimeLine
