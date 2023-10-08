import Link from 'next/link'
import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
  link: string
}

const Button: FC<Props> = ({ children, link }) => {
  return (
    <Link className="Hover Btn-Link" href={link}>
      {children}
    </Link>
  )
}

export default Button
