import LeftSider from '../Container/Left'
import ListTop from './ListTop'
import ListBottom from './ListBottom'
import ListCenter from './ListCenter'

export default function InfoCard() {
  return (
    <LeftSider>
      <ListTop />
      <ListCenter />
      <ListBottom />
    </LeftSider>
  )
}
