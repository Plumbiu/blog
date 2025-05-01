import type { DefinitionType } from './config/definitions'
import type { VariableType } from './config/variables'
import type { EmojiType } from './config/emoji'

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
  definitions?: DefinitionType
  variable?: VariableType
  emoji?: EmojiType
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
