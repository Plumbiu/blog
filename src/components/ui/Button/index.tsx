import Link from 'next/link'
import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
  link: string
}

const page: FC<Props> = ({ children, link }) => {
  return (
    <Link
      className="hover-style"
      href={link}
      style={{
        fontWeight: '500',
        fontSize: '0.875rem',
        textAlign: 'center',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        padding: '6px 8px',
        color: '#1976d2',
        borderRadius: '2px',
        minWidth: '45px',
      }}
    >
      {children}
    </Link>
  )
}

export default page
