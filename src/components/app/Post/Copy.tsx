'use client'

import { FC, useEffect } from 'react'
import { CopyIcon } from '@/components/icons/lang'

const CopyComponent: FC<{
  text: string
}> = ({ text }) => {
  async function copy() {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="pre-copy" onClick={copy}>
      <CopyIcon />
    </div>
  )
}

export default CopyComponent
