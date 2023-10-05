import ListTop from './ListTop'
import './index.css'
import ListBottom from './ListBottom'
import ListCenter from './ListCenter'
import TagsCmp from '@/components/Tags'
import { useRequest } from '@/lib/api'
import CategoriesCmp from '@/components/Categories'
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
          <TagsCmp tags={tags} />
        </div>
        <div className="Side-Left-Item">
          <Title>分类</Title>
          <CategoriesCmp categories={categories} />
        </div>
      </div>
    </div>
  )
}
