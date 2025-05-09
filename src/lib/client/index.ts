import { isValidElement, type ReactNode } from 'react'
import { isArray, isNumber, isObject, isString } from '../types'

type ClassNameArg = any
export function cn(...args: ClassNameArg[]) {
  let classname = ''
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (isString(arg) || isNumber(arg)) {
      if (classname) {
        classname += ' '
      }
      classname += arg
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) {
          if (classname) {
            classname += ' '
          }
          classname += key
        }
      }
    }
  }

  return classname || undefined
}

export function renderReactNodeToString(node: ReactNode) {
  // 递归遍历 reactnode, 形成 textContent
  let textContent = ''
  function render(node: ReactNode) {
    if (isString(node) || isNumber(node)) {
      textContent += node
    } else if (
      isValidElement(node) &&
      isObject(node.props) &&
      'children' in node.props
    ) {
      const { children } = node.props
      if (children) {
        if (isArray(children)) {
          for (const child of children) {
            render(child)
          }
        } else {
          render(children)
        }
      }
    }
  }
  render(node)
  return textContent
}
