import Link from 'next/link'
import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
  link: string
  prefetch?: boolean
}

const Button: FC<Props> = ({ children, link, prefetch = true }) => {
  return (
    <Link prefetch={prefetch} className="Hover Btn-Link" href={link}>
      {children}
    </Link>
  )
}

export default Button
