import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { RootContent } from 'mdast'

function tocVisit(nodes: RootContent[]) {
  const toc: Toc[] = []
  for (const node of nodes) {
    if (node.type === 'heading' && node.depth < 4) {
      const child = node.children[0]

      if (child && child.type === 'text') {
        toc.push({
          level: node.depth,
          hash: `#user-content-${child.value.replace(/\s/g, '')}`,
          content: child.value,
        })
      }
    }
  }
  return toc
}

export async function getTocs(md: string) {
  const ast = unified().use(remarkParse).parse(`# 目录\n${md}`)
  const tocs = tocVisit(ast.children)
  return { tocs }
}
