import { isArray, isString } from '@/lib/types'
import type { Element } from 'hast'

export function addRehypeNodeClassName(node: Element, className: string) {
  const props = node.properties
  let originClassName = props.className || props.class || ''
  if (isArray(originClassName)) {
    originClassName = originClassName.join(' ')
  }
  if (!isString(originClassName)) {
    return originClassName
  }
  const classNameSet = new Set(
    (originClassName + ' ' + className).trim().split(' '),
  )
  node.properties.className = [...classNameSet].join(' ')
}
