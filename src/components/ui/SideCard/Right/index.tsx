import React from 'react'
import Title from '../../Title'
import Chips from '../Chips'
import { useRequest } from '@/lib/api'
import '../index.css'

const RightCard = async () => {
  const tags = await useRequest<Tag[]>('tags')
  const categories = await useRequest<Category[]>('categories')
  return (
    <div className="Side-W">
      <div className='Side-W Side-Fixed'>
        <div className="Side-Item">
          <Title>标签</Title>
          <Chips path="tags" chips={tags} />
        </div>
        <div className="Side-Item">
          <Title>分类</Title>
          <Chips path="categories" chips={categories} />
        </div>
      </div>
    </div>
  )
}

export default RightCard
