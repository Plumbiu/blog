import { cn } from '@/utils/client'
import { monthArr } from '@/constants'
import { PostMeta } from '@/utils/node/markdown'
import styles from './PostInfo.module.css'

function formatTime(time: string | number) {
  const d = new Date(time)
  const month = monthArr[d.getMonth()]
  return `${month} ${String(d.getDate()).padStart(3, ' 0')}, ${d.getFullYear()}`
}

type TimeWordInfoProps = Pick<PostMeta, 'date' | 'wordLength'> & {
  className?: string
}
export function TimeWordInfo({
  date,
  wordLength,
  className,
}: TimeWordInfoProps) {
  return (
    <div className={cn(styles.info, className)}>
      <div>{formatTime(date)}</div>
      <div className="verticalLine" />
      <div>{(wordLength / 225).toFixed(0)} min read</div>
      <div className="verticalLine" />
      <div>{wordLength} 字</div>
    </div>
  )
}
