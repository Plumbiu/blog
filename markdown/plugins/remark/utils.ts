import type { ReamrkCommonNode } from '../types'

export function addNodeClassName(node: ReamrkCommonNode, className: string) {
  const props = node?.data?.hProperties
  if (!props) {
    return
  }
  const originClassName = props.className?.trim() ?? props.class?.trim() ?? ''
  const classNameSet = new Set(
    `${originClassName} ${className}`.trim().split(' '),
  )
  props.class = [...classNameSet].join(' ')
}
