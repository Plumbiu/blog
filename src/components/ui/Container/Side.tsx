import { type FC, type ReactNode } from 'react'
import './Side.css'

interface Props {
  children: ReactNode
}

const Side: FC<Props> = ({ children }) => {
  return (
    <div className="blog-side-w">
      <div
        className="blog-side-w"
        style={{
          position: 'fixed',
          boxShadow: '0px 1px 4px -1px rgba(0, 0, 0, 0.2)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Side
