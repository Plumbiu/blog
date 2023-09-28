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
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Side
