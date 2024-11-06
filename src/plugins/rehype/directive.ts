import { type ContainerDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'
import { addNodeClassName, makeProperties } from '../utils'
import { ComponentKey, RemarkReturn } from '../constant'

export function remarkContainerDirectivePlugin(): RemarkReturn {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      makeProperties(node)
      noteContainerDirective(node)
      detailContainerDirective(node)
    })
    visit(tree, 'textDirective', (node, index, parent) => {
      if (!parent) {
        return
      }
      parent.type = 'root'
      makeProperties(node)
      node.data!.hName = 'div'
      node.data!.hProperties![ComponentKey] = node.name
    })
  }
}

function detailContainerDirective(node: ContainerDirective) {
  if (node.name === 'Details') {
    node.data!.hName = 'details'
    const summary = node.children[0]
    if (summary.type === 'paragraph') {
      const children = summary.children
      if (!children || !summary.data?.directiveLabel) {
        return
      }
      const firstChild = children[0]
      makeProperties(firstChild)
      firstChild.data!.hName = 'summary'
      node.children[0] = firstChild as any
    }
  }
}

function noteContainerDirective(node: ContainerDirective) {
  if (node.name === 'Note') {
    const data = node.data!
    const props = data.hProperties!
    data.hName = 'blockquote'
    const className = node.attributes?.class
    addNodeClassName(node, `blockquote-${className}`)
    const firstChild = node.children[0]
    if (firstChild.type === 'paragraph' && firstChild.data?.directiveLabel) {
      props['data-title'] = true
    }
  }
}
export default noteContainerDirective
