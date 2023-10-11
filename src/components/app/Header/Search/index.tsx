'use client'

import type { FC } from 'react'
import '@docsearch/css'
import { DocSearch } from '@docsearch/react'

interface Props {
  id: string
  apiKey: string
  name: string
}

const Search: FC<Props> = ({ id, apiKey, name }) => {
  return <DocSearch appId={id} apiKey={apiKey} indexName={name} />
}

export default Search
