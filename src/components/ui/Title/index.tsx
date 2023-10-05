import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  align?: 'center' | 'left' | 'right' | 'inherit'
  p?: number
  children: ReactNode
}

const Title: FC<Props> = ({ children, align = 'center', p = 16 }) => {
  return <div className="Title">{children}</div>
}

export default Title
