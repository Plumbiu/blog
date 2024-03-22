// TODO lazy load with mask

import { NodeType } from '.'

export function rewriteImageWrapper(node: NodeType) {
  if (node.type === 'element' && node.tagName === 'p') {
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
}
