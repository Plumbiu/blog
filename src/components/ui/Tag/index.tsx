import type { FC, ReactNode } from 'react'
import './index.css'
import Link from 'next/link'

interface Props {
  link?: string
  text: ReactNode
}

function channel() {
  return Math.floor((Math.random() + 3) * 40).toString(16)
}

function limitChannel() {
  const r = channel().padStart(2, '0')
  const g = channel().padStart(2, '0')

  return [r, g, 'ef'].sort(() => Math.random() - 0.5)
}

function randomColor() {
  return '#' + limitChannel().join('')
}

const Tag: FC<Props> = ({ text, link }) => {
  const color = randomColor()
  if (link) {
    return (
      <Link style={{ color }} className="Tag" href={link}>
        {text}
      </Link>
    )
  }

  return <span className="Tag Tag-Filled">{text}</span>
}

export default Tag
