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
  ...rest
}: CardProps) {
  const className = cn(styles.card, {
    [styles.active]: active,
    [styles.disabled]: disabled,
    [styles.transition]: !disabled,
  })
  if (href) {
    return (
      <Link href={href} scroll={scroll} className={className} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}

export default Card
