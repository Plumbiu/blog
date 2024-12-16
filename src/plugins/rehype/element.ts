import type { Element } from 'hast'
import { visit } from 'unist-util-visit'
import type { RehypePlugin } from '../constant'
import markCustomComponentPre from './mark-pre'

const rehypeElementPlugin: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      blankTargetPlugin(node)
      markCustomComponentPre(node)
    })
  }
}

export default rehypeElementPlugin

function blankTargetPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
    node.properties.className = 'link'
  }
}
