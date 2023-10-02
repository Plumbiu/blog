import Link from 'next/link'
import type { FC, ReactNode } from 'react'

interface Props {
  link: string
  text: string
  icon: ReactNode
}

const ButtonIcon: FC<Props> = ({ link, text, icon }) => {
  return (
    <Link
      className="hover-btn-icon-style"
      href={link}
      style={{
        display: 'inline-flex',
        height: '30px',
        lineHeight: '30px',
        alignItems: 'center',
        padding: '0 6px',
        color: '#1976d2',
        fontSize: '0.8125rem',
        letterSpacing: '1px',
        borderRadius: '4px',
        gap: 6,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(25, 118, 210, 0.5)',
      }}
    >
      <div>{icon}</div>
      <div>{text}</div>
    </Link>
  )
}

export default ButtonIcon
