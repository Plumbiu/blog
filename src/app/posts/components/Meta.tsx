import { TimeWordInfo } from '@/components/PostInfo'
import type { PostList } from '@/utils/node/markdown'
import styles from './Meta.module.css'

function Meta({ meta }: PostList) {
  const { title, date, wordLength } = meta
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <TimeWordInfo
        wordLength={wordLength}
        date={date}
        className={styles.info}
      />
    </div>
  )
}

export default Meta
