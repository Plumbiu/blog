import { Metadata } from 'next'
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

export function joinWebUrl(...args: string[]) {
  let url = BlogUrl
  for (const arg of args) {
    url += arg
    if (!arg.endsWith('/')) {
      url += arg
    }
  }
  return url
}

export const Blog_Title = `${BlogAuthor}の博客`
export const Blog_Desc = 'Note, life, summary and blog'
