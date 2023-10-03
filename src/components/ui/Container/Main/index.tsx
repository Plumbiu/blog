import { type FC, type ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
}

const Main: FC<Props> = ({ children }) => {
  return <div className="blog-main">{children}</div>
}

export default Main
