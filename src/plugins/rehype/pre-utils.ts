import type { Element, ElementContent } from 'hast'

export function markPre(node: Element, children: ElementContent[]) {
  node.tagName = 'pre'
  if (!node.data) {
    node.data = {}
  }
  node.children = children
}
