import { ReactNode } from 'react'
import styles from './IconCard.module.css'

interface TechItemProps {
  icon: ReactNode
  text: string
}

function IconCard({ icon, text }: TechItemProps) {
  return (
    <div className={styles.card}>
      {icon}
      <div>{text}</div>
    </div>
  )
}

export default IconCard
