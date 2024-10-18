'use client'

import { FC, useState } from 'react'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/components/Icons'

const Copy: FC<{
  text: string
}> = ({ text }) => {
  const [icon, setIcon] = useState(<CopyIcon />)
  function copy() {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIcon(<CopyCheckIcon />)
      })
      .catch(() => {
        setIcon(<CopyErrorIcon />)
      })
      .finally(() => {
        setTimeout(() => {
          setIcon(<CopyIcon />)
        }, 750)
      })
  }

  return (
    <div className="pre-copy" onClick={copy}>
      {icon}
    </div>
  )
}

export default Copy
