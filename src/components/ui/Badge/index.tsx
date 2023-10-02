import type { FC, ReactNode } from 'react'

interface Props {
  count: number
  children: ReactNode
}

const Badge: FC<Props> = ({ count, children }) => {
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          textAlign: 'center',
          fontSize: '0.75rem',
          lineHeight: '18px',
          height: '18px',
          color: '#fff',
          borderRadius: '10px',
          padding: '1px 6px',
          backgroundColor: '#9C27B0',
          top: '-10px',
          right: '-4px',
        }}
      >
        {count}
      </span>
      <span>{children}</span>
    </div>
  )
}

export default Badge
