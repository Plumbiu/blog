import { NodeType } from '.'

export function rewriteToc(node: NodeType) {
  const tocs = []
  if (
    node.type === 'element' &&
    node.tagName[0] === 'h' &&
    +node.tagName[1] > 0 &&
    +node.tagName[1] < 7
  ) {
    const id = node.properties.id as string
    tocs.push({
      level: +node.tagName[1],
      hash: '#' + id,
      content: (node.children[0] as any).value,
    })
  }
  return tocs
}
