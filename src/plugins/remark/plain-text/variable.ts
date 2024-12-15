import type { Text, InlineCode } from 'mdast'
import { isNumber, isString } from '@/utils/types'
import { injectNodeValue } from './utils'
import vars from '../data/variable'

const BracketStart = '${'
const BracketEnd = '}'
// obj['a'].b['c'] => obj.a.b.c
const LeftBracketRegx = /\[['"]/g
const RightBracketRegx = /['"]\]/g
function injectVariable(node: Text | InlineCode, code: string) {
  injectNodeValue(code, node, BracketStart, BracketEnd, (value) => {
    const str = value
      .replace(RightBracketRegx, '')
      .replace(LeftBracketRegx, '.')
    const keys = str.split('.')
    let data: Record<string, any> | string = vars
    for (const key of keys) {
      if (isString(data) || isNumber(data) || !data[key]) {
        break
      }
      data = data[key]
    }
    if (isString(data) || isNumber(data)) {
      return data
    }
    return JSON.stringify(data)
  })
}

export default injectVariable
