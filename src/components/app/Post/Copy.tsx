'use client'
import { toast } from 'sonner'
import { FC } from 'react'
import { CopyIcon } from '@/components/icons/lang'

const CopyComponent: FC<{
  text: string
}> = ({ text }) => {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('复制成功')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  return (
    <div className="pre-copy" onClick={copy}>
      <CopyIcon />
    </div>
  )
}

export default CopyComponent
