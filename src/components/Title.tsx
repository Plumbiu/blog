import type { ReactNode } from 'react'
import styles from './Title.module.css'
import { cn } from '@/lib/client'

export default function Title({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(styles.title, className)}>{children}</div>
}
