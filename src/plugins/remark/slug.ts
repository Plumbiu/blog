import { visit } from 'unist-util-visit'
import { Link, type Heading } from 'mdast'
import { RemarkReturn } from '../constant'
import { makeProperties } from '../utils'

const WhiteSpaceRegx = /\s/g
export function formatId(id: string) {
  return id.toLowerCase().replace(WhiteSpaceRegx, '-')
}

function getElementText(node: Heading | Link) {
  let text = ''
  for (const child of node.children) {
    if (child.type === 'text') {
      text += child.value
    } else if (child.type === 'link' && child.children) {
      text += getElementText(child)
    }
  }
  return text
}

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
      const value = getElementText(node)
      if (value) {
        props.id = formatId(value)
      }
    })
  }
}
