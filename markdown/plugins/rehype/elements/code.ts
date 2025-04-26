import type { Element } from 'hast'
import { addNodeClassName } from '../utils'
import { mono } from '@/app/fonts'

export default function codeElementPlugin(node: Element) {
  if (node.tagName === 'code') {
    addNodeClassName(node, mono.className)
  }
}
