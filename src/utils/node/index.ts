/* eslint-disable @stylistic/function-paren-newline */
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import yaml from 'js-yaml'
import { minify_sync } from 'terser'
import sharp from 'sharp'
import { FrontmatterWrapStr, PostDir } from '@/constants'
import stripMarkdown from './strip-markdown'
import { getCategory, removeMdSuffix } from '../index'

export interface PostMeta {
  title: string
  date: number
  desc: string
  subtitle: string
  hidden?: boolean
  tags?: string[]
  wordLength: number
}

export async function getPostPaths() {
  const results: string[] = []
  await Promise.all(
    PostDir.map(async (dir) => {
      const postsPath = path.join(process.cwd(), 'posts', dir)
      const posts = (await fsp.readdir(postsPath)).filter((p) =>
        p.endsWith('.md'),
      )
      results.push(...posts.map((p) => `posts/${dir}/${p}`))
    }),
  )
  return results
}

const DescNumRegx = /^\d+$/
export function parsePostMeta(code: string) {
  const startIdx = code.indexOf(FrontmatterWrapStr)
  if (startIdx !== 0) {
    return {}
  }
  const endIndex = code.indexOf(FrontmatterWrapStr, 1)
  const parseString = code.slice(FrontmatterWrapStr.length, endIndex)
  const meta = yaml.load(parseString) as PostMeta
  const desc = meta.desc
  const content = code.slice(endIndex + 3)
  const rawText = stripMarkdown(content).trim()
  if (desc && DescNumRegx.test(desc)) {
    const segments = rawText.split(/\r?\n/g).filter((s) => s.trim())
    meta.desc = segments.length > 0 ? segments[+desc - 1] : ''
  }
  if (meta.date) {
    meta.date = new Date(meta.date).valueOf()
  }
  meta.wordLength = rawText.replace(/\s+/g, '').length
  return {
    meta,
    content,
  }
}

export interface PostList {
  meta: PostMeta
  path: string
  content: string
  next?: PostList
  prev?: PostList
}

export async function getPostList(postType?: string) {
  const result: PostList[] = []
  const mds = await getPostPaths()
  await Promise.all(
    mds.map(async (mdPath) => {
      const type = getCategory(mdPath)
      if (postType != null && type !== postType) {
        return
      }
      const file = await fsp.readFile(mdPath, 'utf-8')
      const { meta, content } = parsePostMeta(file)
      if (!meta || !content || meta.hidden) {
        return
      }
      const data = {
        meta,
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

export function tryReadFileSync(p: string) {
  let content = ''
  try {
    content = fs.readFileSync(p, 'utf-8')
  } catch (error) {}

  return content
}

export function minify(code: string) {
  code = code.replace('"use strict";', '')
  const mini = minify_sync(code, {
    compress: {
      ecma: 2018,
      ie8: false,
    },
    mangle: { toplevel: true },
  }).code
  if (!mini) {
    return code
  }
  return mini
}

export async function getBlurDataUrl(filePath: string) {
  const image = sharp(filePath)
  const metadata = await image.metadata()
  const originWidth = metadata.width
  const originHeight = metadata.height
  if (!originHeight || !originWidth) {
    return {}
  }
  const resizedSize = 14
  const resizedImage = image.resize({
    width: Math.min(originWidth, resizedSize),
    height: Math.min(originHeight, resizedSize),
    fit: 'inside',
  })
  const output = resizedImage.webp({
    quality: 20,
    alphaQuality: 20,
    smartSubsample: true,
  })

  const { data } = await output.toBuffer({ resolveWithObject: true })

  return {
    base64: `data:image/webp;base64,${data.toString('base64')}`,
    metadata,
  }
}
