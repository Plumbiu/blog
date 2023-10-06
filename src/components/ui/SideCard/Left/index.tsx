import '../index.css'
import SideCardCenter from './Center'
import SideCardBottom from './Bottom'
import SideCardTop from './Top'

export default function LeftSideCard() {
  return (
    <div className="Side-Left">
      <div className="Side-Item">
        <SideCardTop />
        <SideCardCenter />
        <SideCardBottom />
      </div>
    </div>
  )
}
