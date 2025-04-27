import type { Element } from 'hast'
import { addNodeClassName } from '../utils'

export default function aElementPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
    addNodeClassName(node, 'link')
    node.properties.rel = 'noreferrer'
  }
}
