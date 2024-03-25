import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'

export async function getTocs(md: string) {
  const ast = unified().use(remarkParse).parse(`# 目录\n${md}`)
  const tocs: Toc[] = []
  visit(ast, 'heading', (node) => {
    const depth = node.depth
    const child = node.children[0]
    if (child.type === 'text') {
      tocs.push({
        level: depth,
        hash: '#' + child.value.replace(/\s/g, ''),
        content: child.value,
      })
    }
  })
  return { tocs }
}
