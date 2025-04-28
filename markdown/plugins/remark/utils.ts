import { isArray, isString } from '@/lib/types'
import type { RemarkNode } from './types'

export function addRemarkNodeClassName(node: RemarkNode, className: string) {
  const props = node?.data?.hProperties
  if (!props) {
    return
  }
  let originClassName = props.className || props.class
  if (isArray(originClassName)) {
    originClassName = originClassName.join(' ')
  }
  if (!isString(originClassName)) {
    return originClassName
  }
  const classNameSet = new Set(
    `${originClassName} ${className}`.trim().split(' '),
  )
  props.class = [...classNameSet].join(' ')
}
