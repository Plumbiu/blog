'use client'

import { useEffect, type FC, useState } from 'react'
import './index.css'

interface Props {}

const HeaderTitle: FC<Props> = ({}) => {
  const [title, setTitle] = useState(document.title)

  return <div>{title}</div>
}

export default HeaderTitle
