import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Container: FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        margin: '60px auto',
      }}
    >
      {children}
    </div>
  )
}

export default Container
