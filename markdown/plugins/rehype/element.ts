import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'
import type { RehypePlugin } from '../constant'
import markCustomComponentPre from './mark-pre'
import { mono } from '@/app/fonts'
import { addNodeClassName } from './utils'

const rehypeElementPlugin: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node, _index, parent) => {
      blankTargetPlugin(node)
      markCustomComponentPre(node)
      animationPlugin(node, parent)
      codeFontPlugin(node)
    })
  }
}

export default rehypeElementPlugin

function blankTargetPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
    node.properties.className = 'link'
    node.properties.rel = 'noreferrer'
  }
}

function animationPlugin(
  node: Element,
  parent: Root | Element | undefined | any,
) {
  if (
    node.tagName === 'summary' ||
    node.tagName === 'code' ||
    parent?.tagName === 'details'
  ) {
    return
  }
  addNodeClassName(node, 'load_ani')
}

function codeFontPlugin(node: Element) {
  if (node.tagName === 'code') {
    addNodeClassName(node, mono.className)
  }
}
