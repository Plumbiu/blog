import Link from 'next/link'
import type { FC, ReactNode } from 'react'
import './Icon.css'

interface Props {
  link: string
  text: string
  icon: ReactNode
}

const ButtonIcon: FC<Props> = ({ link, text, icon }) => {
  return (
    <Link className="hover-btn-icon-style Button-Icon-Link" href={link}>
      <div>{icon}</div>
      <div>{text}</div>
    </Link>
  )
}

export default ButtonIcon
