import type { Root } from 'hast'
import { visit } from 'unist-util-visit'

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
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p') {
        const children = node.children
        if (children && children.length > 1) {
          const isImgs = children.every((el) => {
            return (
              (el.type === 'element' && el.tagName === 'img') ||
              (el.type === 'text' &&
                (el.value === '\r\n' || el.value === '\n'))
            )
          })
          if (isImgs) {
            node.properties.className = 'Img-Wrapper'
          }
        }
      }
    })
  }
}

export const rehypeSlug: RehypePlugin<undefined> = () => {
  const WHITE_REGX = /\s/g
  return (tree) => {
    visit(tree, 'element', (node) => {
      const tagName = node.tagName
      if (tagName[0] === 'h') {
        const depth = +node.tagName[1]
        if (depth > 0 && depth < 7) {
          const heading = node.children[0]
          if (heading.type === 'text') {
            node.properties.id = heading.value.replace(WHITE_REGX, '')
          }
        }
      }
    })
  }
}
