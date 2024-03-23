import { NodeType } from '.'

export function rewriteToc(node: NodeType) {
  if (
    node.type === 'element' &&
    node.tagName[0] === 'h' &&
    +node.tagName[1] > 0 &&
    +node.tagName[1] < 7
  ) {
    const val = node.children[0]
    if (val.type === 'text') {
      node.properties.id = val.value.replace(/\s/g, '')
    }
  }
}
