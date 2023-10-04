import type { FC, ReactNode } from 'react'
import './index.css'

interface Props {
  left: ReactNode
  right: ReactNode
  icon: ReactNode
  bgcolor: string
}

const TimeLine: FC<Props> = ({ left, right, icon, bgcolor }) => {
  return (
    <div className="TimeLine">
      <div className="TimeLine-Left">{left}</div>
      <div className="TimeLine-Center">
        <div
          className="TimeLine-Center-Icon"
          style={{
            backgroundColor: bgcolor,
          }}
        >
          {icon}
        </div>
        <div className="TimeLine-Center-Bar" />
      </div>
      <div className="TimeLine-Right">{right}</div>
    </div>
  )
}

export default TimeLine
