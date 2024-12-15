import { visit } from 'unist-util-visit'
import type { RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'

const WhiteSpaceRegx = /\s/g
export function formatId(id: string) {
  return id.toLowerCase().replace(WhiteSpaceRegx, '-')
}

function getElementText(node: { children?: any[] }) {
  if (!node.children) {
    return ''
  }
  let text = ''
  for (const child of node.children) {
    if (child.type === 'text') {
      text += child.value
    } else if ('children' in child) {
      text += getElementText(child)
    }
  }
  return text
}

const remarkSlug: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      makeProperties(node)
      const data = node.data!
      const props = data.hProperties!
      const value = getElementText(node)
      if (value) {
        props.id = formatId(value)
        props['data-title'] = value
      }
    })
  }
}

export default remarkSlug
