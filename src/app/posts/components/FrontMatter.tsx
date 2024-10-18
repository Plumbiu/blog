import styles from './FrontMatter.module.css'
import { monthArr } from '@/utils'

interface Props {
  title: string
  date: number
}

function formatTime(time: string | number) {
  const d = new Date(time)
  const month = monthArr[d.getMonth()]
  const year = d.getFullYear()
  return `${year} ${month} ${String(d.getDate()).padStart(3, ' 0')}`
}

function FrontMatter({ title, date }: Props) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.date}>{formatTime(date)}</span>
    </div>
  )
}

export default FrontMatter
