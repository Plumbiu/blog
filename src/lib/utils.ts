import GithubSlugger from 'github-slugger'

const slugger = new GithubSlugger()

export function transfromId(id: string) {
  slugger.reset()
  return slugger.slug(id)
}

export function upperFirst(str: string) {
  const firstChar = str[0].toUpperCase()
  if (str.length === 1) {
    return firstChar
  }
  return firstChar + str.slice(1)
}
