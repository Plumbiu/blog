import React from 'react'
import './index.css'
import TagsCmp from '@/components/Tags'
import { useRequest } from '@/lib/api'
import CategoriesCmp from '@/components/Categories'

const RightCard = async () => {
  const tags = await useRequest<Tag[]>('tags')
  const categories = await useRequest<Tag[]>('categories')

  return (
    <div className="Side-Left Side-Left-W">
      <div className="Side-Left-Fixed Side-Left-W">
        <div className='Side-Left-Item'>
          <div className="Side-Left-Title">标签</div>
          <TagsCmp tags={tags} />
        </div>
        <div className='Side-Left-Item'>
          <div className="Side-Left-Title">分类</div>
          <CategoriesCmp categories={categories} />
        </div>
      </div>
    </div>
  )
}

export default RightCard
