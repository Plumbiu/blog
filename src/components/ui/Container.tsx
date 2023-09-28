import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Container: FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        marginTop: '72px',
        marginLeft: '10px',
        marginRight: '10px',
      }}
    >
      {children}
    </div>
  )
}

export default Container
