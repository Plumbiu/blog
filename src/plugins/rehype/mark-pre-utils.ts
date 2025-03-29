import type { Element, ElementContent } from 'hast'

export function markPre(node: Element, children: ElementContent[]) {
  node.tagName = 'pre'
  if (!node.data) {
    node.data = {}
  }
  node.children = children
}

interface HCodeParams {
  code: string
  props: Record<string, string>
  meta: string
}

export function hCode({ code, props, meta }: HCodeParams): Element {
  return {
    type: 'element',
    tagName: 'code',
    properties: props,
    data: {
      meta,
    },
    children: [{ type: 'text', value: code }],
  }
}
