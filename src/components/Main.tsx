import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Main: FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '330px',
        top: '10%',
        right: '15px',
        padding: 4,
        backgroundColor: '#fff'
      }}
    >
      {children}
    </div>
  )
}

export default Main
