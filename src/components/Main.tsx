import { type FC, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Main: FC<Props> = ({ children }) => {
  return <div className="blog-main">{children}</div>
}

export default Main
