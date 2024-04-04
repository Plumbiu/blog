import Link from 'next/link'
import type { CSSProperties, FC, ReactNode } from 'react'
import './index.css'

interface Props {
  icon: ReactNode
  text: string
  link?: string
  py?: number
  px?: number
  blank?: boolean
}

const ButtonListIcon: FC<Props> = ({
  icon,
  text,
  link,
  py = 14,
  px = 16,
  blank = true,
}) => {
  const child = (
    <>
      <div className="Btn-List-Icon">{icon}</div>
      <div className="Btn-List-Text">{text}</div>
    </>
  )
  const p: CSSProperties = {
    padding: `${py}px ${px}px`,
  }

  return link ? (
    <Link
      className="Hover Btn-List-Icon-Link"
      href={link}
      target={blank ? '_blank' : '_self'}
      style={p}
    >
      {child}
    </Link>
  ) : (
    <div className="Hover Btn-List-Icon-Link" style={p}>
      {child}
    </div>
  )
}

export default ButtonListIcon
