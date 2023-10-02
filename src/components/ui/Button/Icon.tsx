import Link from 'next/link'
import type { FC, ReactNode } from 'react'

interface Props {
  icon: ReactNode
  text: string
  link?: string
}

const ButtonIcon: FC<Props> = ({ icon, text, link }) => {
  return link ? (
    <Link
      className="hover-a-style"
      href={link}
      target="__blank"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
      }}
    >
      <div
        style={{
          color: 'rgba(0, 0, 0, 0.54)',
          minWidth: '42px',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          letterSpacing: '0.2px',
        }}
      >
        {text}
      </div>
    </Link>
  ) : (
    <div
      className="hover-a-style"
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
      }}
    >
      <div
        style={{
          color: 'rgba(0, 0, 0, 0.54)',
          minWidth: '42px',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          letterSpacing: '0.2px',
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default ButtonIcon
