import { NodeType } from '.'

export function rewriteCodeLang(node: NodeType) {
  const langMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
  }

  if (node.type === 'element' && node.tagName === 'pre') {
    const child = node.children[0]
    if (child.type === 'element' && child.tagName === 'code') {
      const prop = (child.properties.className as string[])?.[0].slice(9)
      if (prop) {
        node.properties['data-lang'] = langMap[prop.toLowerCase()] ?? prop
      }
    }
  }
}
