import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
}

const Stack: FC<Props> = ({ children }) => {
  return <div className="Stack">{children}</div>
}

export default Stack
