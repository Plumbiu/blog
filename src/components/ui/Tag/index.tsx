import type { FC, ReactNode } from 'react'
import './index.css'
import Link from 'next/link'

interface Props {
  filled?: boolean
  link?: string
  text: ReactNode
}

function randomColor() {
  const colors = [
    'blueviolet',
    'darkgoldenrod',
    'var(--blog-color-light)',
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

const Tag: FC<Props> = ({ text, link, filled }) => {
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
