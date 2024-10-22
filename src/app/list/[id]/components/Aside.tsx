import Link from 'next/link'
import styles from './Aside.module.css'
import { FloatItem } from '../types'

interface ListFloatProps {
  items: [string, FloatItem[]][]
}

const ListFloat = ({ items }: ListFloatProps) => {
  return (
    <aside className={styles.content}>
      {items.map(([year, items]) => (
        <div key={year} className={styles.item}>
          <div className={styles.year}>{year}</div>
          <ul className={styles.links}>
            {items.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}

export default ListFloat
