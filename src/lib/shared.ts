import { Categoires, type CategoiresType } from '~/data/constants/categories'
import { BasePath } from '~/config/site'
import { isArray, keys } from './types'
import isPlainObject from 'is-plain-obj'

type Nil = null | undefined

const RemoveMdSuffixRegx = /\.md$/
export const removeMdSuffix = (p: string | Nil) => {
  if (p == null) {
    return ''
  }
  return p.replace?.(RemoveMdSuffixRegx, '')
}

export const upperFirst = (s: string | Nil) => {
  if (s == null || s === '') {
    return ''
  }
  return s[0].toUpperCase() + s.slice(1)
}

export function resolveBasePath(p: string) {
  return `${BasePath}${p[0] === '/' ? p : `/${p}`}`
}

export function isJsxFileLike(p: string) {
  return (
    p.endsWith('.js') ||
    p.endsWith('.jsx') ||
    p.endsWith('.ts') ||
    p.endsWith('.tsx')
  )
}

const frontmatterSet: Set<string> = new Set(Categoires)
export function getCategoryFromUrl(url: string) {
  const urls = url.split('/')
  for (const url of urls) {
    if (frontmatterSet.has(url)) {
      return url as CategoiresType
    }
  }
  return 'blog'
}

export function isUnOptimized(url: string) {
  return url.endsWith('.gif') || url.endsWith('.webp') || url.endsWith('.svg')
    ? true
    : undefined
}

export function getBase64Url(base: string) {
  return `data:image/webp;base64,${base}`
}

export function isEmptyObject(object: unknown) {
  if (object == null || typeof object !== 'object') {
    return false
  }
  return keys(object).length === 0
}

export function toLogValue(value: any) {
  if (isPlainObject(value) || isArray(value)) {
    return JSON.stringify(value)
  }
  return String(value)
}
