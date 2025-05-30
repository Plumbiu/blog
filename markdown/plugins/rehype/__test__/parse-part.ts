import { test, expect } from 'vitest'
import { parsePart } from '~/markdown/utils/parse-part'

test('isLineInNumRangeCallback', () => {
  // This code is modified based on: https://github.com/euank/node-parse-numeric-range/blob/master/test/test.js
  //  LICENSE: https://github.com/euank/node-parse-numeric-range/blob/master/LICENSE
  const it = (s: string, arr: number[]) => {
    const meta = `{${s}}`
    const rangeSet = parsePart(meta)
    expect(rangeSet).toEqual(new Set(arr))
  }
  it('1', [1])
  it('1,1', [1, 1])

  it('1-5', [1, 2, 3, 4, 5])
  it('5-1', [5, 4, 3, 2, 1])
  it('1-3,5-6', [1, 2, 3, 5, 6])
  it('10..15', [10, 11, 12, 13, 14, 15])
  it('10...15', [10, 11, 12, 13, 14])
  it('10..12,13...15,2,8', [10, 11, 12, 13, 14, 2, 8])
  it('', [])
  it('-5', [-5])
  it('-5--10', [-5, -6, -7, -8, -9, -10])
  it('-1..2,-1...2', [-1, 0, 1, 2, -1, 0, 1])
  it('1-2,3-4', [1, 2, 3, 4])
})
