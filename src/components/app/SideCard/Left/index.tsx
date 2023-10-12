import '../index.css'
import SideCardBottom from './Bottom'
import SideCardTop from './Top'

export default function LeftSideCard() {
  return (
    <div className="Side-Left">
      <div className="Side-Item">
        <SideCardTop />
        <SideCardBottom />
      </div>
    </div>
  )
}
