import { visit } from 'unist-util-visit'
import { type Text, type InlineCode } from 'mdast'
import { isNumber, isString } from '@/utils/types'
import vars from '~/data/variable'
import { RemarkPlugin } from '../constant'

// obj['a'].b['c'] => obj.a.b.c
const LeftBracketRegx = /\[['"]/g
const RightBracketRegx = /['"]\]/g

export const remarkVarInject: RemarkPlugin<string> = (code: string) => {
  const BracketStart = '${'
  const BracketEnd = '}'
  const BracketStartLen = BracketStart.length
  const BracketEndLen = BracketEnd.length
  function handleValue(node: Text | InlineCode) {
    const position = node.position
    if (!position || !position.start.offset || !position.end.offset) {
      return
    }
    const isInlineCode = node.type === 'inlineCode'
    const offset = isInlineCode ? 1 : 0
    let value = code.slice(
      position.start.offset + offset,
      position.end.offset - offset,
    )

    const start = value.indexOf(BracketStart)
    const end = value.lastIndexOf(BracketEnd)
    if (start === -1 || end === -1) {
      return
    }
    const prefix = value.slice(0, start)
    const suffix = value.slice(end + BracketEndLen)
    value = value.slice(start, end + BracketEndLen)
    if (value.startsWith(BracketStart) && value.endsWith(BracketEnd)) {
      const str = value
        .slice(BracketStartLen, -BracketEndLen)
        .trim()
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
        node.value = prefix + data + suffix
      } else {
        node.value = prefix + JSON.stringify(data) + suffix
      }
    }
  }

  return (tree) => {
    visit(tree, 'text', handleValue)
    visit(tree, 'inlineCode', handleValue)
  }
}
