import type { Element } from 'hast'
import { visit } from 'unist-util-visit'
import markRunnerPre from './runner-pre'
import markPlaygroundPre from './playground-pre'
import type { RehypePlugin } from '../constant'

const rehypeElementPlugin: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      blankTargetPlugin(node)
      markPlaygroundPre(node)
      markRunnerPre(node)
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
