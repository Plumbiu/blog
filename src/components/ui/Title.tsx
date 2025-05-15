import type { ReactNode } from 'react'
import styles from './Title.module.css'
import { cn } from '@/lib/client'
import Link from 'next/link'

export default function Title({
  children,
  className,
  href,
  ...rest
}: {
  children: ReactNode
  className?: string
  href?: string
  [key: string]: any
}) {
  const cls = cn(styles.title, className)
  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}
