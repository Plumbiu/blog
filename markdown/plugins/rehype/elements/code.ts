import type { Element } from 'hast'
import { addRehypeNodeClassName } from '../utils'
import { mono } from '@/app/fonts'

export default function codeElementPlugin(node: Element) {
  if (node.tagName === 'code') {
    addRehypeNodeClassName(node, mono.className)
  }
}
