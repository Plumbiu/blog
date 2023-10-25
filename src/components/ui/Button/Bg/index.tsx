import Link from 'next/link'
import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  link: string
  children: ReactNode
}

const ButtonBg: FC<Props> = ({ link, children }) => {
  return (
    <div className="Button-Bg">
      <Link href={link}>{children}</Link>
    </div>
  )
}

export default ButtonBg
