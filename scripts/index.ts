import { getPostList } from '@/utils/node/markdown'
import feed from './feed'
import { gitadd } from './utils.js'

export type FileMap = Record<string, string>

async function generate() {
  const posts = await getPostList()
  gitadd(await feed(posts))
}

generate()
