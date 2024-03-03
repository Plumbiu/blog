'use client'

import { useEffect, type FC, useState } from 'react'
import './index.css'

interface Props {}

const HeaderTitle: FC<Props> = ({}) => {
  const [title, setTitle] = useState('')

  useEffect(() => {
    setTitle(document.title.split('| ')?.[1] ?? document.title)
  })

  return <h1 className="Header-Title">{title}</h1>
}

export default HeaderTitle
