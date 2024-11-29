import { clsx } from 'clsx'
import { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  [key: string]: any
}

function Card({ children, active, disabled = false, ...rest }: CardProps) {
  return (
    <div
      className={clsx(styles.card, {
        [styles.active]: active,
        [styles.disabled]: disabled,
        [styles.transition]: !disabled,
      })}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
