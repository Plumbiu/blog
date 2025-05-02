import Link from 'next/link'
import styles from './NotFound.module.css'
import { cn } from '@/lib/client'

function NotFound2() {
  return (
    <div className={cn('fcc', styles.wrap)}>
      <h1>404</h1>
      <div>This page is missing ......</div>
      <Link className={styles.tag} href="/">Back to Home</Link>
    </div>
  )
}

export default NotFound2
