// TODO lazy load with mask

import { NodeType } from '.'

export function rewriteLazyImage(node: NodeType) {
  if (node.type === 'element' && node.tagName === 'img') {
    node.properties.loading = 'lazy'
  }
}
