import type { Metadata } from 'next'
import { isString } from '@/lib/types'
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
  for (const arg of args) {
    if (arg == null) {
      continue
    }
    url += arg
    if (isString(arg) && arg[0] !== '/') {
      url += '/'
    }
  }
  return url
}
