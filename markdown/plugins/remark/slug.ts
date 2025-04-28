import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import type { RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'

const WhiteSpaceRegx = /\s/g
export function formatId(id: string) {
  return id.toLowerCase().replace(WhiteSpaceRegx, '-')
}

const remarkSlugPlugin: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      makeProperties(node)
      const data = node.data!
      const props = data.hProperties!
      const value = toString(node)
      if (value) {
        props.id = formatId(value)
      }
    })
  }
}

export default remarkSlugPlugin
