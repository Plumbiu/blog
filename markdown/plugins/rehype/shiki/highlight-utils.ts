import { isString } from '@/lib/types'

// This code is modified based on
// https://github.com/euank/node-parse-numeric-range/blob/master/index.js
//  LICENSE: https://github.com/euank/node-parse-numeric-range/blob/master/LICENSE
const RangeNumRegx = /^-?\d+$/
const LineRegx = /^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/
export function parsePart(s: string) {
  const res = new Set()
  let m: RegExpMatchArray | null
  for (let str of s.split(',')) {
    str = str.trim()
    if (RangeNumRegx.test(str)) {
      res.add(Number.parseInt(str, 10))
    } else if ((m = str.match(LineRegx))) {
      let [_, lhs, sep, rhs] = m as any
      if (lhs && rhs) {
        lhs = Number.parseInt(lhs)
        rhs = Number.parseInt(rhs)
        const incr = lhs < rhs ? 1 : -1
        if (sep === '-' || sep === '..' || sep === '\u2025') {
          rhs += incr
        }

        for (let i = lhs; i !== rhs; i += incr) {
          res.add(i)
        }
      }
    }
  }

  return res
}

const NumRangeRegx = /{([\d,-]+)}/
export const calculateLinesToHighlight = (meta: string) => {
  const parsed = NumRangeRegx.exec(meta)
  if (parsed === null) {
    return () => false
  }
  const strlineNumbers = parsed[1]
  const lineNumbers = parsePart(strlineNumbers)
  return (index: number) => lineNumbers.has(index + 1)
}

export const getLanguage = (className: any) => {
  if (isString(className)) {
    className = className.split(' ')
  }
  for (const classListItem of className) {
    if (isString(classListItem) && classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase()
    }
  }
  return 'txt'
}

export const HighLightWordClassName = 'highlight-word'
export const HighLightWordStartClassName = `${HighLightWordClassName}-start`
export const HighLightWordEndClassName = `${HighLightWordClassName}-end`
export const HighLightLineClassName = 'highlight-line'
export const DiffInsertedClassName = 'inserted'
export const DiffDeletedClassName = 'deleted'
