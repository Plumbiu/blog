import type { ReactNode } from 'react'
import { Link } from 'next-view-transitions'
import { cn } from '@/lib/client'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  href?: string
  scroll?: boolean
  [key: string]: any
}

function Card({
  children,
  active,
  disabled = false,
  scroll,
  href,
  className,
  ...rest
}: CardProps) {
  const cls = cn(styles.card, className, {
    [styles.active]: active,
    [styles.disabled]: disabled,
    [styles.transition]: !disabled,
  })
  if (href) {
    return (
      <Link href={href} scroll={scroll} className={cls} {...rest}>
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

export default Card
