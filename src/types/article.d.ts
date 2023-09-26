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
}

interface FullFrontMatter extends RawMatter {
  desc: string
  id: string
}
