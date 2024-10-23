import Link from 'next/link'
import styles from './Aside.module.css'
import { FloatItem } from '../types'
import { MenuIcon } from '@/app/components/Icons'

interface ListFloatProps {
  items: [string, FloatItem[]][]
}

const ListFloat = ({ items }: ListFloatProps) => {
  return (
    <aside className={styles.wrap}>
      <div className={styles.btn}>
        <MenuIcon />
      </div>
      <div className={styles.content}>
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
      </div>
    </aside>
  )
}

export default ListFloat
