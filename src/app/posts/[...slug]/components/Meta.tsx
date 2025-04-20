import { cn } from '@/lib/client'
import styles from './Meta.module.css'

function Meta({ title }: { title: string }) {
  return (
    <div className={cn('load_ani', styles.wrap)}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  )
}

export default Meta
