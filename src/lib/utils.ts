import GithubSlugger from 'github-slugger'

const slugger = new GithubSlugger()

export function transfromId(id: string) {
  slugger.reset()
  return slugger.slug(id)
}
