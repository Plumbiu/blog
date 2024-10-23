import { type ContainerDirective } from 'mdast-util-directive'
import { addNodeClassName } from '../utils'

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
