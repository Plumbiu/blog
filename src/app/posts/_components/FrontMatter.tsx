import { FrontMatterItem } from '@/utils/node'
import IconCard from '@/app/_components/IconCard'
import { TimeWordInfo } from '@/app/_components/PostInfo'
import styles from './FrontMatter.module.css'

function FrontMatter({ title, date, tags, wordLength }: FrontMatterItem) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <TimeWordInfo wordLength={wordLength} date={date} />
      {tags && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <IconCard key={tag} icon="#" text={tag} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FrontMatter
