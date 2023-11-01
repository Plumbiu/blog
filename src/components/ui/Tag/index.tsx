import type { FC, ReactNode } from 'react'
import './index.css'
import Link from 'next/link'

interface Props {
  plain?: boolean
  key?: string
  outlined?: boolean
  link?: string
  text: ReactNode
}

function channel() {
  return Math.floor(Math.random() * 200).toString(16)
}

function limitChannel() {
  const r = channel().padStart(2, '0')
  const g = channel().padStart(2, '0')

  return [r, g, 'e2'].sort(() => Math.random() - 0.5)
}

function randomColor() {
  return '#' + limitChannel().join('')
}

const Tag: FC<Props> = ({ outlined, text, link, plain }) => {
  const color = randomColor()
  if (plain && link) {
    return (
      <Link style={{ color }} className="Tag" href={link}>
        {text}
      </Link>
    )
  }
  if (link) {
    return (
      <Link
        style={{ color }}
        className={`Tag ${outlined ? 'Tag-Outlined' : 'Tag-Filled'}`}
        href={link}
      >
        {text}
      </Link>
    )
  }

  return (
    <span className={`Tag ${outlined ? 'Tag-Outlined' : 'Tag-Filled'}`}>
      {text}
    </span>
  )
}

export default Tag
