import type { Element } from 'hast'
import { addRehypeNodeClassName } from '../utils'

export default function aElementPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
    addRehypeNodeClassName(node, 'link')
    node.properties.rel = 'noreferrer'
  }
}
