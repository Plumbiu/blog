import { isValidElement, type ReactNode } from 'react'
import { PostDir, type FrontmatterKey } from '@/constants'
import { BasePath } from '~/data/site'
import { isArray, isNumber, isString } from './types'

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

export function renderReactNodeToString(node: ReactNode) {
  // 递归遍历 reactnode, 形成 textContent
  let textContent = ''
  function render(node: ReactNode) {
    if (isString(node) || isNumber(node)) {
      textContent += node
    } else if (isValidElement(node)) {
      const { children } = node.props
      if (children) {
        if (isArray(children)) {
          for (const child of children) {
            render(child)
          }
        } else {
          render(children)
        }
      }
    }
  }
  render(node)
  return textContent
}
