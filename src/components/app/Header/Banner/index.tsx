import type { FC } from 'react'
import './index.css'

interface Props {}

const HeaderBanner: FC<Props> = ({}) => {
  return (
    <div className="Header-Banner">
      <div>
        <h1>Plumbiu の 小屋</h1>
        <span>|首页</span>
      </div>
    </div>
  )
}

export default HeaderBanner
