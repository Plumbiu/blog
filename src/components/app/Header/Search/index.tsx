'use client'

import type { FC } from 'react'
import '@/styles/docsearch/button.css'
import dynamic from 'next/dynamic'

const DocSearch = dynamic(() =>
  import('@docsearch/react').then((cmp) => cmp.DocSearch),
)

interface Props {
  id: string
  apiKey: string
  name: string
}

const Search: FC<Props> = ({ id, apiKey, name }) => {
  // @ts-ignore
  import('@/styles/docsearch/modal.css')

  return <DocSearch appId={id} apiKey={apiKey} indexName={name} />
}

export default Search
