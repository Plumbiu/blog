import type { Element } from 'hast'

export default function aElementPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
    node.properties.className = 'link'
    node.properties.rel = 'noreferrer'
  }
}
