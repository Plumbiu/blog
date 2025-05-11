// This code is modified based on
// https://github.com/euank/node-parse-numeric-range/blob/master/index.js
//  LICENSE: https://github.com/euank/node-parse-numeric-range/blob/master/LICENSE
const RangeNumRegx = /^-?\d+$/
const LineRegx = /^(-?\d+)(-|\.\.\.?)(-?\d+)$/
export function parsePart(s: string | undefined | null) {
  const res = new Set<number>()
  if (!s) {
    return res
  }
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
