import { FrontMatterItem } from '@/utils/node'
import { TimeWordInfo } from '@/app/_components/PostInfo'
import styles from './FrontMatter.module.css'

function FrontMatter({ title, date, wordLength }: FrontMatterItem) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <TimeWordInfo wordLength={wordLength} date={date} />
    </div>
  )
}

export default FrontMatter
