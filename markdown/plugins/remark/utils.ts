import { isArray, isString } from '@/lib/types'
import type { RemarkNode } from './types'
import { makeProperties } from '../utils'
import { handleComponentName } from '../constant'

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

export function markComponent(node: RemarkNode, componentName?: string) {
  makeProperties(node)
  node.type = 'root'
  node.data!.hName = 'div'
  if (componentName) {
    const props = node.data!.hProperties!
    handleComponentName(props, componentName)
  }
}
