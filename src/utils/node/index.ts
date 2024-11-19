import fs from 'node:fs'
import fsp from 'node:fs/promises'
import yaml from 'js-yaml'
import { minify_sync } from 'terser'
import { FrontmatterWrapStr } from '@/constants'
import stripMarkdown from '../strip-markdown'
import {
  isLikeNum,
  getCategory,
  removeMdSuffix,
  joinFormatPaths,
} from '../index'

export interface FrontMatterItem {
  title: string
  date: number
  desc: string
  subtitle: string
  hidden?: boolean
  tags?: string[]
}

export type FrontmatterKey = 'note' | 'life' | 'blog' | 'summary'

export async function getMarkdownPath() {
  const results: string[] = []
  const postsDir = await fsp.readdir('posts')
  await Promise.all(
    postsDir.map(async (dir) => {
      const postsPath = joinFormatPaths('posts', dir)
      const posts = await fsp.readdir(postsPath)
      results.push(...posts.map((p) => joinFormatPaths(postsPath, p)))
    }),
  )
  return results
}

export function getFrontmatter(content: string) {
  const startIdx = content.indexOf(FrontmatterWrapStr)
  if (startIdx !== 0) {
    return {}
  }
  const endIndex = content.indexOf(FrontmatterWrapStr, 1)
  const parseString = content.slice(FrontmatterWrapStr.length, endIndex)
  const frontmatter = yaml.load(parseString) as FrontMatterItem
  const desc = frontmatter.desc
  const mdContent = content.slice(endIndex + 3)
  if (desc && isLikeNum(desc)) {
    const segments = stripMarkdown(mdContent)
      .trim()
      .split(/\r?\n/g)
      .filter((s) => s.trim())
    frontmatter.desc = segments[+desc - 1]
  }
  if (frontmatter.date) {
    frontmatter.date = new Date(frontmatter.date).valueOf()
  }
  return {
    frontmatter,
    mdContent,
  }
}

export interface PostInfo {
  type: FrontmatterKey
  frontmatter: FrontMatterItem
  content: string
  path: string
}

export async function getPostsInfo(id?: string) {
  const result: PostInfo[] = []
  const mds = await getMarkdownPath()
  await Promise.all(
    mds.map(async (mdPath) => {
      const type = getCategory(mdPath)
      if (id != null && type !== id) {
        return
      }
      const file = await fsp.readFile(mdPath, 'utf-8')
      const { frontmatter, mdContent } = getFrontmatter(file)
      if (!frontmatter || !mdContent || frontmatter.hidden) {
        return
      }
      const data = {
        type,
        frontmatter,
        content: mdContent,
        path: removeMdSuffix(mdPath),
      }
      result.push(data)
    }),
  )

  return result.sort(
    (prev, next) => next.frontmatter.date - prev.frontmatter.date,
  )
}

export function tryReadFileSync(p: string) {
  let content = ''
  try {
    content = fs.readFileSync(p, 'utf-8')
  } catch (error) {}

  return content
}

export function minify(code: string) {
  const mini = minify_sync(code).code
  if (!mini) {
    return code
  }
  return mini
}
