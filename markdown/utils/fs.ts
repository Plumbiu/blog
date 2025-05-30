import fsp from 'node:fs/promises'
import path from 'node:path'
import { glob } from 'tinyglobby'
import { getCategoryFromUrl, removeMdSuffix } from '../../src/lib/shared'
import { CWD, PostPath } from '~/data/constants/node'
import type { PostList } from '../types'
import { parsePostMeta } from './meta-parse'
import { Categoires, type CategoiresType } from '~/data/constants/categories'

export function getPostsPath() {
  return glob('posts/**/*.md')
}

interface Archive {
  categories: Array<{
    type: CategoiresType
    count: number
  }>
  tags: string[]
}

export async function getAllTags() {
  const posts = await getPost()
  const tagSet = new Set<string>()
  for (const post of posts) {
    if (
      !post.meta.tags ||
      (process.env.NODE_ENV === 'production' && post.meta.hidden)
    ) {
      continue
    }
    for (const tag of post.meta.tags) {
      tagSet.add(tag)
    }
  }
  return [...tagSet]
}

export async function getArchive(): Promise<Archive> {
  const categories = await Promise.all(
    Categoires.map(async (type) => {
      const dirs = await fsp.readdir(path.join(PostPath, type))
      return {
        type,
        count: dirs.length,
      }
    }),
  )

  const tags = await getAllTags()
  return {
    categories,
    tags,
  }
}

export async function getPost(filter?: (post: PostList) => boolean) {
  const result: PostList[] = []
  const mds = await getPostsPath()

  await Promise.all(
    mds.map(async (mdPath) => {
      const tokens = mdPath.split('/')
      const type = getCategoryFromUrl(mdPath)

      const file = await fsp.readFile(path.join(CWD, mdPath), 'utf-8')
      const { meta, content } = parsePostMeta(file)
      if (
        !(meta && content) ||
        (meta.hidden && process.env.NODE_ENV === 'production')
      ) {
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
      if (!filter || filter(data)) {
        result.push(data)
      }
    }),
  )
  const data = result.sort((prev, next) => {
    const dateDiff = next.meta.date - prev.meta.date
    if (dateDiff !== 0) {
      return dateDiff
    }
    return prev.meta.title.localeCompare(next.meta.title)
  })

  data.sort((prev, curr) => {
    const prevMeta = prev.meta
    const currMeta = curr.meta
    const prevOrder = prevMeta.order
    const currOrder = currMeta.order
    const hasOrderPrev = prevOrder !== undefined
    const hasOrderCurr = currOrder !== undefined

    if (hasOrderPrev && hasOrderCurr) {
      // 两者都有 order，直接比较
      return prevOrder - currOrder
    }
    if (!hasOrderPrev && !hasOrderCurr) {
      // 两者都没有 order，保持原顺序
      return 0
    }
    // 只有一方有 order，有 order 的排在前面
    return hasOrderPrev ? -1 : 1
  })

  for (let i = 0; i < data.length; i++) {
    data[i].prev = data[i - 1]
    data[i].next = data[i + 1]
  }

  return data
}
