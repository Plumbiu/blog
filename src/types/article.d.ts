interface IArticleParams {
  id: string
}

interface IArticle extends IRawMatter {
  id: string
  content: string
}

interface IRawMatter {
  title: string
  date: Date
  updated: Date
  tags: string[]
  categories: string[]
  cover?: string
  desc?: string
}

interface IFullFrontMatter extends IRawMatter {
  id: string
}
