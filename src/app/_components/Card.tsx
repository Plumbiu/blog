import { clsx } from 'clsx'
import { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  active?: boolean
  disabled?: boolean
}

function Card({ children, active, disabled = false }: CardProps) {
  return (
    <div
      className={clsx(styles.card, {
        [styles.active]: active,
        [styles.disabled]: disabled,
        [styles.transition]: !disabled,
      })}
    >
      {children}
    </div>
  )
}

export default Card
