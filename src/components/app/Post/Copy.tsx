'use client'
import { FC, useState } from 'react'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/components/icons/lang'
import './copy.css'

const CopyComponent: FC<{
  text: string
}> = ({ text }) => {
  const [icon, setIcon] = useState(<CopyIcon />)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setIcon(<CopyCheckIcon />)
    } catch (error) {
      setIcon(<CopyErrorIcon />)
    } finally {
      setTimeout(() => {
        setIcon(<CopyIcon />)
      }, 750)
    }
  }

  return (
    <div className="pre-copy" onClick={copy}>
      {icon}
    </div>
  )
}

export default CopyComponent
