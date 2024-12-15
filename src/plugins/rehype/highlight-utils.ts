// This code is modified based on
// https://github.com/euank/node-parse-numeric-range/blob/master/index.js

import { isString } from '@/utils/types'

/*
  LICENSE: https://github.com/euank/node-parse-numeric-range/blob/master/LICENSE

  Copyright (c) 2014, Euank <euank@euank.com>

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted, provided that the above
  copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
const RangeNumRegx = /^-?\d+$/
const LineRegx = /^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/
export function parsePart(s: string) {
  let res = new Set()
  let m
  for (let str of s.split(',')) {
    str = str.trim()
    if (RangeNumRegx.test(str)) {
      res.add(parseInt(str, 10))
    } else if ((m = str.match(LineRegx))) {
      let [_, lhs, sep, rhs] = m as any
      if (lhs && rhs) {
        lhs = parseInt(lhs)
        rhs = parseInt(rhs)
        const incr = lhs < rhs ? 1 : -1
        if (sep === '-' || sep === '..' || sep === '\u2025') rhs += incr

        for (let i = lhs; i !== rhs; i += incr) res.add(i)
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
  if (!Array.isArray(className)) {
    className = [className]
  }
  for (const classListItem of className) {
    if (isString(classListItem)) {
      if (classListItem.slice(0, 9) === 'language-') {
        return classListItem.slice(9).toLowerCase()
      }
    }
  }
  return 'txt'
}

export const HighLightWordClassName = 'highlight-word'
export const HighLightLineClassName = 'highlight-line'
export const DiffInsertedClassName = 'inserted'
export const DiffDeletedClassName = 'deleted'
