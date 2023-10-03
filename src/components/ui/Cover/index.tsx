import type { FC, ReactNode } from 'react'
import './index.css'
interface Props {
  children: ReactNode
}

const Cover: FC<Props> = ({ children }) => {
  return <div className="Cover">{children}</div>
}

export default Cover
