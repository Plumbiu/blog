import { PostDir, type FrontmatterKey } from '@/constants'
import { BasePath } from '~/data/site'
import { isString } from './types'

const RemoveMdSuffixRegx = /\.md$/
export const removeMdSuffix = (p: string) => {
  return p.replace(RemoveMdSuffixRegx, '')
}

export const upperFirstChar = (s: string) => {
  return s[0].toUpperCase() + s.slice(1)
}

export function resolveAssetPath(p: string) {
  return `${BasePath}/${p}`
}

export function isJsxFileLike(p: string) {
  return (
    p.endsWith('.js') ||
    p.endsWith('.jsx') ||
    p.endsWith('.ts') ||
    p.endsWith('.tsx')
  )
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

export function isUnOptimized(url: string) {
  return url.endsWith('.gif') || url.endsWith('.webp') || url.endsWith('.svg')
    ? true
    : undefined
}


