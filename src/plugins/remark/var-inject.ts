import { visit } from 'unist-util-visit'
import { type Text, type Code, type InlineCode } from 'mdast'
import { isString } from '@/utils/types'
import vars from '~/data/variable'
import { RemarkPlugin } from '../constant'

// obj['a'].b['c'] => obj.a.b.c
const LeftBracketRegx = /\[['"]/g
const RightBracketRegx = /['"]\]/g

export const remarkVarInject: RemarkPlugin<string> = (code: string) => {
  const BracketStart = '${'
  const BracketEnd = '}'
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

    if (isString(value)) {
      const start = value.indexOf(BracketStart)
      const end = value.lastIndexOf(BracketEnd)
      if (start === -1 || end === -1) {
        return
      }
      const prefix = value.slice(0, start)
      const suffix = value.slice(end + BracketEnd.length)
      value = value.slice(start, end + BracketEnd.length)
      if (value.startsWith(BracketStart) && value.endsWith(BracketEnd)) {
        const str = value
          .slice(2, -2)
          .trim()
          .replace(RightBracketRegx, '')
          .replace(LeftBracketRegx, '.')
        const keys = str.split('.')
        let obj: Record<string, any> | string = vars
        for (const key of keys) {
          if (isString(obj) || !obj[key]) {
            break
          }
          obj = obj[key]
        }
        if (isString(obj)) {
          node.value = prefix + obj + suffix
        }
      }
    }
  }

  return (tree) => {
    visit(tree, 'text', handleValue)
    visit(tree, 'inlineCode', handleValue)
  }
}
