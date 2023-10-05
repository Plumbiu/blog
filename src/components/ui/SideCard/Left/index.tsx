import './index.css'
import Chips from '@/components/ui/SideCard/Chips'
import { useRequest } from '@/lib/api'
import Title from '../../Title'
import SideCardCenter from './Center'
import SideCardBottom from './Bottom'
import SideCardTop from './Top'

export default async function LeftSideCard() {
  const tags = await useRequest<Tag[]>('tags')
  const categories = await useRequest<Tag[]>('categories')
  return (
    <div className="Side-Left-W">
      <div className="Side-Left-W Side-Left-List">
        <div className="Side-Left-Item">
          <SideCardTop />
          <SideCardCenter />
          <SideCardBottom />
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
