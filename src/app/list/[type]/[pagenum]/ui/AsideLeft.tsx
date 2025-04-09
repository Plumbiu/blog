import { Link } from 'next-view-transitions'
import type { PostList } from '@/lib/node/markdown'
import styles from './AsideLeft.module.css'

interface ListFloatProps {
  items: [string, PostList[]][]
}

const AsideLeft = ({ items }: ListFloatProps) => {
  return (
    <aside className={styles.wrap}>
      {items.map(([year, items]) => (
        <div key={year} className={styles.item}>
          <div className={styles.year}>{year}</div>
          <ul className={styles.links}>
            {items.map((item) => (
              <li key={item.path}>
                <Link href={`/${item.path}`}>{item.meta.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}

export default AsideLeft
