import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  count?: number
  children: ReactNode
}

const Badge: FC<Props> = ({ count, children }) => {
  return (
    <div>
      <div className="Badge-Wrap">
        {count && <span className="Badge-Content">{count}</span>}
        <span>{children}</span>
      </div>
    </div>
  )
}

export default Badge
