import '../index.css'
import SideCardBottom from './Bottom'
import SideCardTop from './Top'

export default function LeftSideCard() {
  return (
    <div className="Side-Left">
      <div>
        <SideCardTop />
        <SideCardBottom />
      </div>
    </div>
  )
}
