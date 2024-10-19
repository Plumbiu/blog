'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import styles from './Navigator.module.css'
import { upperFirstChar } from '@/utils'

const paths = ['blog', 'life', 'summary', 'note']

function Navigator() {
  const path = usePathname()
  return (
    <div className={styles.action}>
      {paths.map((p) => (
        <Link
          className={clsx({
            [styles.active]: path?.includes(p),
          })}
          key={p}
          href={'/list/' + p}
        >
          {upperFirstChar(p)}
        </Link>
      ))}
    </div>
  )
}

export default Navigator
