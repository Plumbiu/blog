interface IArticle {
  id: string
  content: string
  title: string
  date: Date
  updated: Date
  readTime: number
  tags: string[]
  categories: string[]
  cover?: string
}

type IFrontMatter = Omit<IArticle, 'content'>
type TRawFrontMatter = Omit<IFrontMatter, 'id'>
