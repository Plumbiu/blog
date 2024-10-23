import { type ContainerDirective } from 'mdast-util-directive'
import { makeProperties } from '../utils'

function detailContainerDirective(node: ContainerDirective) {
  if (node.name === 'Details') {
    makeProperties(node)
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

export default detailContainerDirective
