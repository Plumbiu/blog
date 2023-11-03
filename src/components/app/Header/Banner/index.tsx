import type { FC } from 'react'
import './index.css'

interface Props {}

const HeaderBanner: FC<Props> = ({}) => {
  return (
    <div
      style={{
        height: '120px',
        backgroundColor: 'rgba(255, 255, 255, .1)',
        marginBottom: '24px',
      }}
    >
    </div>
  )
}

export default HeaderBanner
