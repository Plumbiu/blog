import type { Root } from 'hast'
import { visit } from 'unist-util-visit'
import { transfromId } from '@/lib/utils'

type RehypePlugin<T> = (options?: T) => (tree: Root) => void

export const rehypeCodeLang: RehypePlugin<undefined> = () => {
  const PREFIX = 'language-'
  const langMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
  }
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre') {
        const child = node.children?.[0]
        if (child.type === 'element' && child.tagName === 'code') {
          const className = child.properties.className as string[] | undefined
          if (className) {
            let lang = className.find((val) => val.startsWith(PREFIX))
            if (lang) {
              lang = lang.slice(PREFIX.length)
              node.properties['data-lang'] = langMap[lang] ?? lang
            }
          }
        }
      }
    })
  }
}

export const rehypeLazyImage: RehypePlugin<undefined> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy'
      }
    })
  }
}

export const rehypeImageWrapper: RehypePlugin<undefined> = () => {
  return (tree) => {
    visit(tree, 'element', (node, _idx, parent) => {
      if (node.tagName === 'img') {
        if (!parent) {
          return
        }

        if (parent.type !== 'element') {
          return
        }
        const children = parent?.children
        if (!children) {
          return
        }
        const classNames = parent.properties.class
        if (Array.isArray(classNames)) {
          const set = new Set(classNames)
          parent.properties.class = [...set]
        } else {
          parent.properties.class = ['chocolat-parent']
        }
      }
    })
  }
}

export const rehypeSlug: RehypePlugin<undefined> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const tagName = node.tagName
      if (tagName[0] === 'h') {
        const depth = +node.tagName[1]
        if (depth > 0 && depth < 7) {
          const heading = node.children[0]
          if (heading.type === 'text') {
            node.properties.id = transfromId(heading.value)
          }
        }
      }
    })
  }
}
