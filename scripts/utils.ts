import fg from 'fast-glob'

export async function getPosts() {
  // eslint-disable-next-line import/no-named-as-default-member
  return fg.glob('posts/**/*.md')
}
