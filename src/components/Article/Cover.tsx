import type { FC, ReactNode } from 'react'
import './Cover.css'
interface Props {
  children: ReactNode
}

const ArticleCover: FC<Props> = ({ children }) => {
  return <div className="Article-Cover">{children}</div>
}

export default ArticleCover
