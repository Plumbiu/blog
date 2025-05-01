import type { DefinitionValue } from 'remark-definition'

export interface PostMeta {
  title: string
  date: number
  desc?: string
  subtitle: string
  tags?: string[]
  image?: string
  order?: number
  // custom
  hidden?: boolean
  wordLength: number
  definitions?: Record<string, DefinitionValue>
  variable?: Record<string, any>
  emoji?: Record<string, string>
}

export interface PostList {
  meta: PostMeta
  type: string
  path: string
  locale?: string
  content: string
  next?: PostList
  prev?: PostList
}
