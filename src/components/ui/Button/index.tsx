import Link from 'next/link'
import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  children: ReactNode
  link: string
}

const page: FC<Props> = ({ children, link }) => {
  return (
    <Link className="hover-style Btn-Link" href={link}>
      {children}
    </Link>
  )
}

export default page
