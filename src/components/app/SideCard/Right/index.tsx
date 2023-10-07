import React from 'react'
import Chips from '../Chips'
import { useRequest } from '@/lib/api'
import '../index.css'
import Title from '@/components/ui/Title'
import DateTitle from '../../DateTitle'

const RightCard = async () => {
  const tags = await useRequest<Tag[]>('tags')
  const categories = await useRequest<Category[]>('categories')
  const archive = await useRequest<Archeve>('archives?limit=5')

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
        <Title>最近文章</Title>
        <DateTitle articles={archive.articles} />
      </div>
      <div className="Side-Item">
        <Title>归档</Title>
        <Chips path="categories" chips={categories} />
      </div>
    </div>
  )
}

export default RightCard
