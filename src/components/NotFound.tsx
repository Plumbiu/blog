import Link from 'next/link'
import Card from './Card'
import styles from './NotFound.module.css'
import { cn } from '@/lib/client'

function NotFound() {
  return (
    <div className={cn('fcc', styles.wrap)}>
      <h1>404</h1>
      <div>This page is missing ......</div>
      <Card active>
        <Link href="/">Back to Home</Link>
      </Card>
    </div>
  )
}

export default NotFound
