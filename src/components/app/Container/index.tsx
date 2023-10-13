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
        width: '95%',
      }}
    >
      {children}
    </div>
  )
}

export default Container
