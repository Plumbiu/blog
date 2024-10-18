import fsp from 'node:fs/promises'
import yaml from 'js-yaml'
import stripMarkdown from './strip-markdown'
import { getLineContent, isLikeNum, getCategory } from '.'

export interface FrontMatterItem {
  title: string
  date: number
  desc: string
  subtitle: string
}

export type FrontmatterKey = 'note' | 'life' | 'blog' | 'summary'

function join(a: string, b: string) {
  return `${a}/${b}`
}

export async function traverse(dirPath: string) {
  const results: string[] = []
  const dirs = await fsp.readdir(dirPath, { withFileTypes: true })
  await Promise.all(
    dirs.map(async (info) => {
      const p = join(dirPath, info.name)
      if (info.isFile()) {
        if (p.endsWith('.md')) {
          results.push(p)
        }
      } else if (info.isDirectory()) {
        const newR = await traverse(p)
        results.push(...newR)
      }
    }),
  )
  return results
}

export function getMarkdownPath() {
  return traverse('posts')
}

export const FrontmatterWrapStr = '---'
export function getFrontmatter(content: string) {
  const startIdx = content.indexOf(FrontmatterWrapStr)
  if (startIdx !== 0) {
    return {}
  }
  const endIndex = content.indexOf(FrontmatterWrapStr, 1)
  const parseString = content.slice(FrontmatterWrapStr.length, endIndex)
  const frontmatter = yaml.load(parseString) as FrontMatterItem
  const desc = frontmatter.desc
  if (desc && isLikeNum(desc)) {
    frontmatter.desc = getLineContent(
      stripMarkdown(content.slice(endIndex + 3)),
      +desc,
    )
  }
  if (frontmatter.date) {
    frontmatter.date = new Date(frontmatter.date).valueOf()
  }
  return {
    frontmatter,
    mdContent: content.slice(endIndex + FrontmatterWrapStr.length),
  }
}

interface PostInfo {
  type: FrontmatterKey
  frontmatter: FrontMatterItem
  content: string
  path: string
}

const RemoveMdSuffixRegx = /\.md$/
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
      const startIdx = file.indexOf(FrontmatterWrapStr)
      if (startIdx !== 0) {
        return
      }
      const { frontmatter, mdContent } = getFrontmatter(file)
      if (!frontmatter || !mdContent) {
        return
      }
      const data = {
        type,
        frontmatter,
        content: mdContent,
        path: mdPath.replace(RemoveMdSuffixRegx, ''),
      }
      result.push(data)
    }),
  )

  return result.sort(
    (prev, next) => next.frontmatter.date - prev.frontmatter.date,
  )
}
