import Link from 'next/link'
import type { CSSProperties, FC, ReactNode } from 'react'

interface Props {
  icon: ReactNode
  text: string
  link?: string
  mw?: number
  py?: number
  blank?: boolean
}

const ButtonIcon: FC<Props> = ({
  icon,
  text,
  link,
  mw = 42,
  py = 14,
  blank = true,
}) => {
  const child = (
    <>
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
          color: 'rgba(0, 0, 0, 0.54)',
          minWidth: mw + 'px',
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
    </>
  )
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${py}px 16px`,
    cursor: 'pointer',
  }
  return link ? (
    <Link
      className="hover-a-style"
      href={link}
      target={blank ? '_blank' : '_self'}
      style={style}
    >
      {child}
    </Link>
  ) : (
    <div className="hover-a-style" style={style}>
      {child}
    </div>
  )
}

export default ButtonIcon
