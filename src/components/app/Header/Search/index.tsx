'use client'

import type { FC } from 'react'
import '@/styles/docsearch/button.css'
import { DocSearch } from '@docsearch/react'

interface Props {
  id: string
  apiKey: string
  name: string
}

const Search: FC<Props> = ({ id, apiKey, name }) => {
  return (
    // @ts-ignore
    <div onClick={async () => await import('@/styles/docsearch/modal.css')}>
      <DocSearch appId={id} apiKey={apiKey} indexName={name} />
    </div>
  )
}

export default Search
