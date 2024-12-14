import { Metadata } from 'next'
import { isNumber } from '@/utils/types'
import { BlogAuthor, BlogUrl } from '~/data/site'

export function generateSeoMetaData(meta: Metadata['openGraph']): Metadata {
  return {
    openGraph: {
      ...meta,
      locale: 'zh_CN',
      type: 'website',
      siteName: `${BlogAuthor}'s blog`,
    },
    twitter: meta,
  }
}

export function joinWebUrl(...args: (string | number)[]) {
  let url = BlogUrl
  for (let arg of args) {
    if (arg === '') {
      continue
    }
    url += arg
    if (isNumber(arg)) {
      arg = String(arg)
    }
    if (!arg.startsWith('/')) {
      url += '/'
    }
  }
  return url
}
