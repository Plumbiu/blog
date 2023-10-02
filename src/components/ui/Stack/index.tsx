import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
  spacing?: number
  m?: number
}

const Stack: FC<Props> = ({ children, spacing = 2, m = 2 }) => {
  return <div className="Stack">{children}</div>
}

export default Stack
