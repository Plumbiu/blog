import Link from 'next/link'
import Chips from '../Chips'
import DateTitle from '../../DateTitle'
import { useGet } from '@/lib/api'
import '../index.css'
import './index.css'

const RightCard = async () => {
  const tags = await useGet<Tag[]>('tag')
  const categories = await useGet<Category[]>('category')
  const archiveArts = await useGet<IFrontMatter[]>('archive?limit=5')
  const archeveYear = await useGet<IArcheveYear[]>('archive/year')

  return (
    <div className="Side-Right">
      <div>
        <div className="Side-Title">标签</div>
        <Chips path="tag" chips={tags} />
      </div>
      <div>
        <div className="Side-Title">分类</div>
        <Chips path="category" chips={categories} />
      </div>
      <div>
        <div className="Side-Title">最近文章</div>
        <DateTitle articles={archiveArts} />
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
