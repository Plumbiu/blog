import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Container: FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        marginTop: '67px',
        marginBottom: '12px',
      }}
    >
      {children}
    </div>
  )
}

export default Container
