import { cn } from '@/lib/client'
import styles from './PostInfo.module.css'
import type { PostMeta } from '~/markdown/types'

const monthArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function formatTime(time: string | number) {
  const d = new Date(time)
  const month = monthArr[d.getMonth()]
  return `${month} ${String(d.getDate()).padStart(3, ' 0')}, ${d.getFullYear()}`
}

type PostReadInfo = Partial<
  Pick<PostMeta, 'date' | 'wordLength'> & {
    className?: string
  }
>
export function PostReadInfo({ date, wordLength, className }: PostReadInfo) {
  return (
    <div className={cn('load_ani', styles.info, className)}>
      {!!date && <div>{formatTime(date)}</div>}
      {!!wordLength && (
        <>
          <div className="verticalLine" />
          {wordLength && <div>{(wordLength / 225).toFixed(0)} min read</div>}
          <div className="verticalLine" />
          <div>{wordLength} 字</div>
        </>
      )}
    </div>
  )
}
