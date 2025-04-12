import fsp from 'node:fs/promises'
import path from 'node:path'
import { glob } from 'fast-glob'
import { getCategory, removeMdSuffix } from '../../src/lib/shared'
import { CWD } from '~/constants/node'
import type { PostList } from '../types'
import { parsePostMeta } from './meta-parse'

export async function getPostsPath() {
  return glob('posts/**/*.md')
}

export async function getPostByPostType(postType?: string) {
  const result: PostList[] = []
  const mds = await getPostsPath()

  await Promise.all(
    mds.map(async (mdPath) => {
      const tokens = mdPath.split('/')
      const type = getCategory(mdPath)
      if (postType != null && type !== postType) {
        return
      }
      const file = await fsp.readFile(path.join(CWD, mdPath), 'utf-8')
      const { meta, content } = parsePostMeta(file)
      if (!(meta && content) || meta.hidden) {
        return
      }
      const isLocale = tokens.length === 4
      const locale = isLocale ? tokens[tokens.length - 2] : undefined
      const data = {
        meta,
        type,
        locale,
        content,
        path: removeMdSuffix(mdPath),
      }
      result.push(data)
    }),
  )
  const data = result.sort((prev, next) => {
    const dateDiff = next.meta.date - prev.meta.date
    if (dateDiff !== 0) {
      return dateDiff
    }
    return prev.meta.title.localeCompare(next.meta.title)
  })
  for (let i = 0; i < data.length; i++) {
    data[i].prev = data[i - 1]
    data[i].next = data[i + 1]
  }

  return data
}
