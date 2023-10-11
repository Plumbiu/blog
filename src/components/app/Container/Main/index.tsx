import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
}

const Main: FC<Props> = ({ children }) => {
  return <div className="Main">{children}</div>
}

export default Main
