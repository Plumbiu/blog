import ListTop from './ListTop'
import './index.css'
import ListBottom from './ListBottom'
import ListCenter from './ListCenter'

export default function LeftSideCard() {
  return (
    <div className="blog-side-left-w">
      <div
        className="blog-side-left-w"
        style={{
          position: 'fixed',
          backgroundColor: '#fff',
          boxShadow: '0px 1px 4px -1px rgba(0, 0, 0, 0.2)',
        }}
      >
        <ListTop />
        <ListCenter />
        <ListBottom />
      </div>
    </div>
  )
}
