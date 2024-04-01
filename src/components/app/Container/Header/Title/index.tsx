'use client'

import { useEffect, type FC, useState } from 'react'
import './index.css'
import Tag from '@/components/ui/Tag'

interface Props {}

const HeaderTitle: FC<Props> = ({}) => {
  const [meta, setMeta] = useState({
    title: '',
    keywords: '',
    categories: '',
  })

  useEffect(() => {
    const metas = document.getElementsByTagName('meta') as any
    const keywords = metas?.keywords?.content
    const categories = metas?.category?.content

    const title = document.title.split('| ')?.[1] ?? document.title
    setMeta({
      title,
      keywords,
      categories,
    })
  }, [])

  return (
    <div className="Header-Title-Wrapper">
      <h2 className="Header-Title">{meta.title}</h2>
      <div className="Header-Title-Tag">
        <Tag text={meta.categories} filled />
        {meta.keywords?.split(',').map((item) => (
          <Tag key={item} text={item} filled />
        ))}
      </div>
    </div>
  )
}

export default HeaderTitle
