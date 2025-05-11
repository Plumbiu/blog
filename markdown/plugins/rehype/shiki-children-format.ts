import { visit } from 'unist-util-visit'
import type { RehypePlugin } from '../constant'

const rehypeCodeFormatPlugin: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName !== 'code' ||
        index == null ||
        !parent ||
        parent.type !== 'element' ||
        parent.tagName !== 'pre'
      ) {
        return
      }
      node.children = node.children.filter((item) => item.type !== 'text')
    })
  }
}
export default rehypeCodeFormatPlugin
