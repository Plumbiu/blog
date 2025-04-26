export type KeywordValue = {
  properties?: Record<string, string>
  value?: string
  url: string
}

const keywordsMap: Record<string, KeywordValue> = {
  'Next.js': {
    url: 'https://github.com/vercel/next.js',
  },
}

export default keywordsMap
