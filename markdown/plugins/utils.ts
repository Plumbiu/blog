import type { ReamrkCommonNode } from './types'

export function makeProperties(node: ReamrkCommonNode) {
  if (!node.data) {
    node.data = {}
  }
  if (!node.data.hProperties) {
    node.data.hProperties = {}
  }
}

export function buildHandlerFunction<T>(key: string, fn?: Function) {
  return (props: any, value?: string | boolean | number): T => {
    const v = props[key]
    if (value == null) {
      if (fn && v) {
        return fn(v)
      }
    } else {
      props[key] = value
    }
    return v
  }
}

export function getFirstLine(s: string) {
  return s.split(/\r?\n/g)[0]
}

export const getBaseName = (p: string) => {
  const idx = p.lastIndexOf('/')
  return p.slice(idx + 1)
}

export function getSuffix(name: string | null) {
  if (name == null) {
    return 'txt'
  }
  const index = name.lastIndexOf('.')
  if (index === -1) {
    return 'txt'
  }
  return name.slice(index + 1)
}
