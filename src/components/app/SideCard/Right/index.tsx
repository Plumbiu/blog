import React from 'react'
import Chips from '../Chips'
import { useRequest } from '@/lib/api'
import '../index.css'
import './index.css'
import Title from '@/components/ui/Title'
// import { formatTime } from '@/lib/time'
// import Link from 'next/link'

const RightCard = async () => {
  const tags = await useRequest<Tag[]>('tags')
  const categories = await useRequest<Category[]>('categories')
  // const archive = await useRequest<Archeve>('archives?limit=5')

  return (
    <div className="Side-Right">
      <div className="Side-Item">
        <Title>标签</Title>
        <Chips path="tags" chips={tags} />
      </div>
      <div className="Side-Item">
        <Title>分类</Title>
        <Chips path="categories" chips={categories} />
      </div>
      <div className="Side-Item">
        <Title>归档</Title>
        <div>
          {/* {archive.articles.map(({ id, title, date }) => (
            <Link key={id} href={'/post/' + id}>
              <div>{title}</div>
              <p>{formatTime(date).split(' ')[0].slice(5)}</p>
            </Link>
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default RightCard
