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
  let str = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '\r' || ch === '\n') {
      return str
    }
    str += ch
  }
  return str
}

export const getBaseName = (p: string) => {
  const idx = p.lastIndexOf('/')
  return p.slice(idx + 1)
}

export function getSuffix(name: string) {
  const index = name.lastIndexOf('.')
  if (index === -1) {
    return ''
  }
  return name.slice(index + 1)
}

