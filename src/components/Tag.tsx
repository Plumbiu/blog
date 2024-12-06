import { ReactNode } from 'react'
import styles from './Tag.module.css'

interface TechItemProps {
  icon: ReactNode
  children: ReactNode
}

function Tag({ icon, children }: TechItemProps) {
  return (
    <div className={styles.card}>
      {icon}
      <div>{children}</div>
    </div>
  )
}

export default Tag
