import './index.css'
import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Container: FC<Props> = ({ children }) => {
  return <div className="Container">{children}</div>
}

export default Container
