import { type FC, type ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
}

const LeftSider: FC<Props> = ({ children }) => {
  return (
    <div className="blog-side-left-w">
      <div
        className="blog-side-left-w"
        style={{
          position: 'fixed',
          backgroundColor: '#fff',
          boxShadow: '0px 1px 4px -1px rgba(0, 0, 0, 0.2)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default LeftSider
