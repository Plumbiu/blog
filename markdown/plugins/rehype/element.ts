import type { Element } from 'hast'
import { visit } from 'unist-util-visit'
import type { RehypePlugin } from '../constant'
import markCustomComponentPre from './mark-pre'
import { mono } from '@/app/fonts'

const rehypeElementPlugin: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      blankTargetPlugin(node)
      markCustomComponentPre(node)
      animationPlugin(node)
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

function addClassName(node: Element, className: string) {
  const props = node.properties
  const cls = props.className || props.class || ''
  const classNameSet = new Set((cls + ' ' + className).trim().split(' '))
  node.properties.className = [...classNameSet].join(' ')
}

function animationPlugin(node: Element) {
  addClassName(node, 'load_ani')
}

function codeFontPlugin(node: Element) {
  if (node.tagName === 'code') {
    addClassName(node, mono.className)
  }
}
