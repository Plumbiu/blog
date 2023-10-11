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

const Tag: FC<Props> = ({ outlined, text, link, plain }) => {
  if (plain && link) {
    return (
      <Link className="Tag Tag-Link Hover-Dark" href={link}>
        {text}
      </Link>
    )
  }
  if (link) {
    return (
      <Link
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
