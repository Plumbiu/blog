import { FrontmatterWrapStr } from '@/constants'
import { StringValueObj } from '@/types/base'

const RemoveMdSuffixRegx = /\.md$/
export const removeMdSuffix = (p: string) => {
  return p.replace(RemoveMdSuffixRegx, '')
}

export const upperFirstChar = (s: string) => {
  return s[0].toUpperCase() + s.slice(1)
}

export function throttle(fn: Function, wait = 300) {
  let start = Date.now()

  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - start < wait) {
      return
    }

    start = now
    fn.apply(this, args)
  }
}

export function isString(x: unknown): x is string {
  return typeof x === 'string'
}

export function isNumber(x: unknown): x is number {
  return typeof x === 'number'
}

export type FrontMatterKey = 'note' | 'life' | 'blog' | 'summary'
const frontmatterSet = new Set(['note', 'life', 'blog', 'summary'])
export function getCategory(urls: string | string[]) {
  if (isString(urls)) {
    urls = urls.split('/')
  }
  for (const url of urls) {
    if (frontmatterSet.has(url)) {
      return url as FrontMatterKey
    }
  }
  return 'blog'
}

export function getFirstLine(s: string) {
  let str = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '\r' || ch === '\n') {
      return str
    }
    str += ch
  }
  return str
}

export const buildFiles = (code: string, startStr: string) => {
  if (!code?.startsWith(startStr)) {
    code = `/// ${startStr}\n${code}`
  }
  const tokens = code.split('///')
  const attrs: StringValueObj = {}
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token[0] === ' ') {
      const str = getFirstLine(tokens[i])
      const key = str.trim()
      attrs[key] = tokens[i].slice(str.length).trim()
    }
  }
  return attrs
}

const DescNumRegx = /^\d+$/
export function isLikeNum(s: string) {
  if (!s) {
    return false
  }
  return DescNumRegx.test(s)
}

export function getSuffix(name: string) {
  const index = name.lastIndexOf('.')
  if (index === -1) {
    return ''
  }
  return name.slice(index + 1)
}

export function padStartZero(str: number | string, num = 2) {
  if (!isString(str)) {
    str = String(str)
  }
  return str.padStart(num, '0')
}

const WhiteSpaceRegx = /\s/g
export function formatId(id: string) {
  return id.toLocaleLowerCase().replace(WhiteSpaceRegx, '-')
}

export function removeFrontmatter(md: string) {
  const startIdx = md.indexOf(FrontmatterWrapStr)
  if (startIdx !== 0) {
    return md
  }
  const endIndex = md.indexOf(FrontmatterWrapStr, 1)
  return md.slice(endIndex + FrontmatterWrapStr.length)
}

export function joinFormatPaths(...args: string[]) {
  return args.join('/')
}

export function getYear(date: number) {
  return String(new Date(date).getFullYear())
}

export function getPathInfo(path: string) {
  const idx = path.lastIndexOf('/')
  return { dirname: path.slice(0, idx), basename: path.slice(idx + 1) }
}
