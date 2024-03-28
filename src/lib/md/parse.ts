import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import { transfromId } from '@/lib/utils'

export async function getTocs(md: string) {
  const ast = remark.parse(md)
  const tocs: Toc[] = [
    {
      level: 0,
      content: '目录',
      hash: '#目录',
    },
  ]
  visit(ast, 'heading', (node) => {
    const depth = node.depth
    const child = node.children[0]
    if (child.type === 'text') {
      tocs.push({
        level: depth,
        hash: '#' + transfromId(child.value),
        content: child.value,
      })
    }
  })

  return { tocs }
}
