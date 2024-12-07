import { Link } from 'next-view-transitions'
import { TimeWordInfo } from '@/components/PostInfo'
import { PostList } from '@/utils/node'
import { cn } from '@/utils/client'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import styles from './Meta.module.css'

function Meta({ meta, prev, next }: PostList) {
  const { title, date, wordLength } = meta
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <TimeWordInfo
        wordLength={wordLength}
        date={date}
        className={styles.info}
      />
      {/* <div className={styles.extra}>
        <Link
          href={'/' + prev?.path}
          className={cn({
            [styles.extra_wrap_disabled]: !prev,
          })}
        >
          <ArrowLeftIcon />
          <div>
            <div className={styles.top_title}>上一篇</div>
            <div>{prev?.meta?.title || '没有上一篇'}</div>
          </div>
        </Link>
        <Link
          href={'/' + next?.path}
          className={cn(styles.next, {
            [styles.extra_wrap_disabled]: !next,
          })}
        >
          <div>
            <div className={styles.top_title}>下一篇</div>
            <div className={styles.extra_title}>
              {next?.meta?.title || 'Last post!'}
            </div>
          </div>
          <ArrowRightIcon />
        </Link>
      </div> */}
    </div>
  )
}

export default Meta
