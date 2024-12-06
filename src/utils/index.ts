import { BasePath, PostDir, type FrontmatterKey } from '@/constants'

const RemoveMdSuffixRegx = /\.md$/
export const removeMdSuffix = (p: string) => {
  return p.replace(RemoveMdSuffixRegx, '')
}

export const upperFirstChar = (s: string) => {
  return s[0].toUpperCase() + s.slice(1)
}

interface ThrottleOptions {
  ignoreFirst: boolean
}

export function throttle(
  fn: Function,
  wait = 300,
  options: ThrottleOptions = { ignoreFirst: false },
) {
  let start = Date.now()
  let { ignoreFirst } = options
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - start < wait) {
      if (ignoreFirst === true) {
        ignoreFirst = false
      } else {
        return
      }
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

export function isFunction(x: unknown): x is Function {
  return typeof x === 'function'
}

export function isSymbol(x: unknown): x is Symbol {
  return typeof x === 'symbol'
}

const frontmatterSet: Set<string> = new Set(PostDir)
export function getCategory(urls: string | string[]) {
  if (isString(urls)) {
    urls = urls.split('/')
  }
  for (const url of urls) {
    if (frontmatterSet.has(url)) {
      return url as FrontmatterKey
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

export const getBaseName = (p: string) => {
  const idx = p.lastIndexOf('/')
  return p.slice(idx + 1)
}

export function getYear(date: number) {
  return String(new Date(date).getFullYear())
}

export function isJsxFileLike(p: string) {
  return (
    p.endsWith('.js') ||
    p.endsWith('.jsx') ||
    p.endsWith('.ts') ||
    p.endsWith('.tsx')
  )
}

export function getType(value: any) {
  const type = Object.prototype.toString.call(value)
  return type.slice(8, type.length - 1)
}

export function resolveAssetPath(p: string) {
  return `${BasePath}/${p}`
}
