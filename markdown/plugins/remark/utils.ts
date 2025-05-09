import { isArray, isString } from '@/lib/types'
import type { RemarkNode } from './types'
import { getFirstLine, makeProperties } from '../utils'
import {
  type FileMap,
  CodeTabSplitString,
  handleComponentName,
} from '../constant'

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

const WhiteSpaceMultiRegx = /\s+/
export const buildFiles = (code: string, defaultSelector?: string) => {
  if (defaultSelector && !code?.startsWith(defaultSelector)) {
    code = `${CodeTabSplitString} ${defaultSelector}\n${code}`
  }
  const tokens = code.split(CodeTabSplitString)
  const attrs: FileMap = {}
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token[0] === ' ') {
      const str = getFirstLine(tokens[i])
      const [key, ...metas] = str.trim().split(WhiteSpaceMultiRegx)
      attrs[key] = {
        code: tokens[i].slice(str.length).trim(),
        meta: metas.join(' '),
      }
    }
  }
  return attrs
}
