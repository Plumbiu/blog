import type { Element } from 'hast'

export function addNodeClassName(node: Element, className: string) {
  const props = node.properties
  const cls = props.className || props.class || ''
  const classNameSet = new Set((cls + ' ' + className).trim().split(' '))
  node.properties.className = [...classNameSet].join(' ')
}
