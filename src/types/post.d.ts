interface IArticle {
  id: string
  content: string
  title: string
  date: Date
  updated: Date
  tags: string[]
  categories: string[]
  desc: string
  cover?: string
}

type IFrontMatter = Omit<IArticle, 'content'>
type TRawFrontMatter = Omit<IFrontMatter, 'id'>
