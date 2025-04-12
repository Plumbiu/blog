export interface PostMeta {
  title: string
  date: number
  desc?: string
  subtitle: string
  hidden?: boolean
  tags?: string[]
  wordLength: number
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
