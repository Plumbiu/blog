import Link from 'next/link'
import styles from './NotFound.module.css'
import { cn } from '@/lib/client'
import Tag from '../ui/Tag'

function NotFound() {
  return (
    <div className={cn('fcc', styles.wrap)}>
      <h1>404</h1>
      <div>This page is missing ......</div>
      <Tag>
        <Link href="/">Back to Home</Link>
      </Tag>
    </div>
  )
}

export default NotFound
