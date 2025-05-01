import type { Text } from 'mdast'
import { isNumber, isString } from '@/lib/types'
import { getRawValueFromPosition } from './utils'
import MagicString from 'magic-string'

// obj['a'].b['c'] => obj.a.b.c
const LeftBracketRegx = /\[['"]/g
const RightBracketRegx = /['"]\]/g
const VariableRegx = /{{([^}]+)}}/g
function replaceWithVariable(node: Text, code: string, variableMap: Record<string, any>) {
  const rawValue = getRawValueFromPosition(code, node)
  if (rawValue) {
    let m: RegExpExecArray | null = null
    const ms = new MagicString(node.value)
    while ((m = VariableRegx.exec(rawValue))) {
      const [raw, match] = m
      if (raw && match) {
        const keys = match
          .replace(RightBracketRegx, '')
          .replace(LeftBracketRegx, '.')
          .split('.')
        let data: Record<string, any> | string = variableMap
        for (const key of keys) {
          if (isString(data) || isNumber(data) || data[key] == null) {
            break
          }
          data = data[key]
        }
        if (!isString(data) && !isNumber(data)) {
          data = JSON.stringify(data)
        }
        ms.update(m.index, m.index + raw.length, String(data))
      }
    }
    node.value = ms.toString()
    VariableRegx.lastIndex = 0
  }
}

export default replaceWithVariable
