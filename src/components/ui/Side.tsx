import { type FC, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Side: FC<Props> = ({ children }) => {
  return <div className="blog-side">{children}</div>
}

export default Side
