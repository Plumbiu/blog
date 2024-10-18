import { visit } from 'unist-util-visit'
import { RemarkReturn } from '../constant'
import { makeProperties } from '../utils'
import { formatId } from '@/utils'

export function remarkSlug(): RemarkReturn {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      makeProperties(node)
      const data = node.data!
      const props = data.hProperties!
      const child = node.children[0]
      if (child.type !== 'text') {
        return
      }
      const value = child.value
      if (value) {
        props.id = formatId(value)
      }
    })
  }
}
