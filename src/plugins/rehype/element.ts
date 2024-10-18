import { visit } from 'unist-util-visit'
import { RehypePlugin } from '../constant'
import markPlaygroundPre from './playground-pre'
import blankTargetPlugin from './blank-link'

function rehypeElementPlugin(): RehypePlugin {
  return (tree) => {
    visit(tree, 'element', (node) => {
      blankTargetPlugin(node)
      markPlaygroundPre(node)
    })
  }
}

export default rehypeElementPlugin
