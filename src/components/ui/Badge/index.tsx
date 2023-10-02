import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  count: number
  children: ReactNode
}

const Badge: FC<Props> = ({ count, children }) => {
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <span className="Badge-Content">{count}</span>
      <span>{children}</span>
    </div>
  )
}

export default Badge
