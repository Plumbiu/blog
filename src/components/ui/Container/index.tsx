import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Container: FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        marginTop: '76px',
        marginLeft: '8px',
        marginRight: '8px',
      }}
    >
      {children}
    </div>
  )
}

export default Container
