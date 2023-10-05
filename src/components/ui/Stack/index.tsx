import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
  spacing?: number
}

const Stack: FC<Props> = ({ children, spacing = 2 }) => {
  return <div className={`Stack Stack-Gap-${spacing}`}>{children}</div>
}

export default Stack
