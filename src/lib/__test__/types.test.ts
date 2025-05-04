import { expect, test } from 'vitest'
import { arrayify } from '../types'

test('arrayify', () => {
  expect(arrayify('a')).toEqual(['a'])
  expect(arrayify([1])).toEqual([1])
})
