import ListTop from './ListTop'
import './index.css'
import ListBottom from './ListBottom'
import ListCenter from './ListCenter'
import Chips from '@/components/ui/SideCard/Chips'
import { useRequest } from '@/lib/api'
import Title from '../../Title'

export default async function LeftSideCard() {
  const tags = await useRequest<Tag[]>('tags')
  const categories = await useRequest<Tag[]>('categories')
  return (
    <div className="Side-Left-W">
      <div className="Side-Left-W Side-Left-List">
        <div className="Side-Left-Item">
          <ListTop />
          <ListCenter />
          <ListBottom />
        </div>
        <div className="Side-Left-Item">
          <Title>标签</Title>
          <Chips chips={tags} />
        </div>
        <div className="Side-Left-Item">
          <Title>分类</Title>
          <Chips chips={categories} />
        </div>
      </div>
    </div>
  )
}
