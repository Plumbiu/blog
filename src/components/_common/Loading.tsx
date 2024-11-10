import { type CSSProperties } from 'react'
import { LoadingIcon } from '@/app/components/Icons'

const LoadingStyles: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100%',
  minHeight: 200,
  textAlign: 'center',
  gap: 4,
}

const SvgStyles: CSSProperties = {
  fontSize: 24,
}

function Loading() {
  return (
    <div style={LoadingStyles}>
      <LoadingIcon style={SvgStyles} />
      <div>Loading....</div>
    </div>
  )
}

export default Loading
