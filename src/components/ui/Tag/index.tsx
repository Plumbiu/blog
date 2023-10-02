import type { FC, ReactNode } from 'react'

interface Props {
  key?: string
  outlined?: boolean
  filled?: boolean
  text: ReactNode
}

const Tag: FC<Props> = ({ outlined, filled, text }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        lineHeight: '22px',
        height: '22px',
        padding: '0 6px',
        border: '1px solid #1976D2',
        borderRadius: '14px',
        minWidth: '24px',
        fontSize: '0.8125rem',
        color: filled ? '#fff' : '#1976D2',
        backgroundColor: outlined ? '#fff' : '#1976D2',
        marginRight: '6px',
      }}
    >
      {text}
    </span>
  )
}

export default Tag
