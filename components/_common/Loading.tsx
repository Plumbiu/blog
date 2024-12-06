import { CSSProperties } from 'react'
import { LoadingIcon } from '@/components/Icons'

const style: CSSProperties = {
  flexDirection: 'column',
}

function Loading() {
  return (
    <div style={style} className="fcc">
      <LoadingIcon fontSize={24} />
      <div>Running...</div>
    </div>
  )
}

export default Loading
