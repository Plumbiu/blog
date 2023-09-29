import { type FC, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Side: FC<Props> = ({ children }) => {
  return (
    <div className="blog-side">
      <div
        style={{
          position: 'fixed',
          width: '300px',
          boxShadow: '0px 1px 4px -1px rgba(0, 0, 0, 0.2)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Side
