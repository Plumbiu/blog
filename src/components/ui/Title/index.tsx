import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
}

const Title: FC<Props> = ({ children }) => {
  return <div className="Title">{children}</div>
}

export default Title
