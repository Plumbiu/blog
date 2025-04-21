export interface PostMeta {
  title: string
  date: number
  desc?: string
  subtitle: string
  tags?: string[]
  image?: string
  
  // custom
  hidden?: boolean
  wordLength: number
}

export interface PostList {
  meta: PostMeta
  type: string
  path: string
  tags: string[]
  locale?: string
  content: string
  next?: PostList
  prev?: PostList
}
