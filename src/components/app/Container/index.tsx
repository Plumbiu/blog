import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Container: FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        margin: '68px auto',
      }}
    >
      {children}
    </div>
  )
}

export default Container
