import ListTop from './ListTop'
import './index.css'
import ListBottom from './ListBottom'
import ListCenter from './ListCenter'

export default function LeftSideCard() {
  return (
    <div className="Side-Left-W">
      <div className="Side-Left-W Side-Left-List-Wrap">
        <ListTop />
        <ListCenter />
        <ListBottom />
      </div>
    </div>
  )
}
