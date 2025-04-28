import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'
import type { RehypePlugin } from '../../constant'
import markCustomComponentPre from './mark-pre'
import { addRehypeNodeClassName } from '../utils'
import aElementPlugin from './a'
import codeElementPlugin from './code'
import BlockquotePlugin from './blockquote'

const rehypeElementPlugin: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node, _index, parent) => {
      aElementPlugin(node)
      markCustomComponentPre(node)
      animationPlugin(node, parent)
      codeElementPlugin(node)
      BlockquotePlugin(node)
    })
  }
}

export default rehypeElementPlugin

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
  addRehypeNodeClassName(node, 'load_ani')
}
