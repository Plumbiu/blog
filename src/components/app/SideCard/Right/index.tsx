import Link from 'next/link'
import Chips from '../Chips'
import { useGet } from '@/lib/api'
import '../index.css'
import './index.css'

const RightCard = async () => {
  const tags = await useGet<Tag[]>('tag')
  const categories = await useGet<Category[]>('category')
  const archeveYear = await useGet<IArcheveYear[]>('archive/year')

  return (
    <div className="Side-Right">
      <div>
        <div className="Side-Title">
          <span>标签</span>
          { tags.length > 15 && <span>更多</span>}
        </div>
        <Chips path="tag" chips={tags.slice(0, 15)} />
      </div>
      <div>
        <div className="Side-Title">分类</div>
        <Chips path="category" chips={categories.slice(0, 15)} />
      </div>
      <div>
        <div className="Side-Title">归档</div>
        {archeveYear.map(({ year, num }) => (
          <Link
            key={year}
            href={'/archive/' + year}
            className="Hover-Dark Side-Archive-Link"
          >
            <div>{year}年</div>
            <div>{num}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RightCard
