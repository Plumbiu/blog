import { memo, type CSSProperties } from 'react'
import { LoadingIcon } from '@/components/Icons'

const style: CSSProperties = {
  flexDirection: 'column',
}

const Loading = memo(() => {
  return (
    <div style={style} className="fcc">
      <LoadingIcon fontSize={24} />
      <div>Running...</div>
    </div>
  )
})

export default Loading
