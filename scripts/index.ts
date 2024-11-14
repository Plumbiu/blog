import fsp from 'node:fs/promises'
import { getPostsInfo } from '@/utils/node'
import generateRss from './rss'
import { gitadd } from './utils.js'

export type FileMap = Record<string, string>

async function generate() {
  const posts = await getPostsInfo()
  const fileMap: FileMap = {}
  await Promise.all(
    posts.map(async (item) => {
      const mdPath = `${item.path}.md`
      const file = await fsp.readFile(mdPath, 'utf-8')
      fileMap[mdPath] = file
    }),
  )
  gitadd(await generateRss(posts))
}

generate()
