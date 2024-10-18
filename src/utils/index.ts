import { StringValueObj } from '@/types/base'

export const removeMdSuffix = (p: string) => {
  return p.slice(0, p.length - 3)
}

export const upperFirstChar = (s: string) => {
  return s[0].toUpperCase() + s.slice(1)
}

export const isUpperChar = (ch: string) => {
  return ch.toUpperCase() === ch
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

export const monthArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
export function formatTime(time: string | number, withDate = false) {
  const d = new Date(time)
  const month = monthArr[d.getMonth()]
  const year = d.getFullYear()
  let result = `${year} ${month}`
  if (withDate) {
    result = `${result} ${d.getDate()}`
  }
  return result
}

export function isString(x: unknown): x is string {
  return typeof x === 'string'
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
      return { str, endIdx: i }
    }
    str += ch
  }
  return { str, endIdx: -1 }
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
      const { str, endIdx } = getFirstLine(tokens[i])
      const key = str.trim()
      attrs[key] = tokens[i].slice(endIdx).trim()
    }
  }
  return attrs
}

export function removeTitle(code: string) {
  code = code.trim()
  if (code[0] !== '#') {
    return code
  }
  const { endIdx } = getFirstLine(code)
  return code.slice(endIdx).trim()
}

const DescNumRegx = /^\d+$/
export function isLikeNum(s: string) {
  if (!s) {
    return false
  }
  return DescNumRegx.test(s)
}

export function getLineContent(code: string, idx = 1) {
  if (idx < 1) {
    idx = 1
  }
  const segments = code
    .trim()
    .split('\n')
    .filter((s) => s.trim())
  return segments[idx - 1].trim()
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

export function isPromise<T extends any>(x: unknown): x is Promise<T> {
  return x instanceof Promise
}
