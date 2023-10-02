import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
  spacing?: number
  m?: number
}

const Stack: FC<Props> = ({ children, spacing = 2, m = 2 }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: spacing * 9 + 'px',
        justifyContent: 'center',
        padding: `${m * 4}px 0`,
      }}
    >
      {children}
    </div>
  )
}

export default Stack
