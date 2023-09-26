interface Params {
  id: string
}

interface Article extends RawMatter {
  id: string
  content: string
}

interface RawMatter {
  title: string
  date: Date
  updated: Date
  tags: string[]
  categories: string[]
  cover?: string
  desc?: string
}

interface FullFrontMatter extends RawMatter {
  id: string
}
