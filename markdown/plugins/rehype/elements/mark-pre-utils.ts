import type { Element, ElementContent } from 'hast'
import { h } from 'hastscript'

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
  const node = h('code', props, code)
  node.data = {
    meta,
  }
  return node
}
