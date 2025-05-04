import { expect, test } from 'vitest'
import {
  getCategoryFromUrl,
  isEmptyObject,
  isJsxFileLike,
  isUnOptimized,
  removeMdSuffix,
  resolveBasePath,
  toLogValue,
  upperFirst,
} from '../shared'
import { Categoires } from '~/data/constants/categories'

test('removeMdSuffix', () => {
  expect(removeMdSuffix(null)).toBe('')
  expect(removeMdSuffix(undefined)).toBe('')
  expect(removeMdSuffix('Test')).toBe('Test')
  expect(removeMdSuffix('Test.md')).toBe('Test')
  expect(removeMdSuffix('.md.tst')).toBe('.md.tst')
})

test('upperFirstChar', () => {
  expect(upperFirst('')).toBe('')
  expect(upperFirst(undefined)).toBe('')
  expect(upperFirst(null)).toBe('')
  expect(upperFirst('aa')).toBe('Aa')
  expect(upperFirst('中a')).toBe('中a')
})

test('resolveBasePath', () => {
  // TODO: mock gitpage
  expect(resolveBasePath('ff')).toBe('/ff')
  expect(resolveBasePath('/ff')).toBe('/ff')
})

test('isJsxFileLike', () => {
  expect(isJsxFileLike('ff')).toBe(false)
  expect(isJsxFileLike('ff.js')).toBe(true)
  expect(isJsxFileLike('ff.ts')).toBe(true)
  expect(isJsxFileLike('ff.jsx')).toBe(true)
  expect(isJsxFileLike('ff.tsx')).toBe(true)
})

test('getCategoryFromUrl', () => {
  expect(getCategoryFromUrl('fff')).toBe('blog')
  expect(getCategoryFromUrl(`fads/${Categoires[0]}/et`)).toBe(Categoires[0])
})

test('isUnOptimized', () => {
  expect(isUnOptimized('v.gif')).toBe(true)
  expect(isUnOptimized('v.webp')).toBe(true)
  expect(isUnOptimized('v.svg')).toBe(true)
  expect(isUnOptimized('v.png')).toBe(undefined)
  expect(isUnOptimized('v.webp.jpg')).toBe(undefined)
})

test('isEmptyObject', () => {
  expect(isEmptyObject({})).toBe(true)
  expect(isEmptyObject({ a: 1 })).toBe(false)
  expect(isEmptyObject([])).toBe(true)
  expect(isEmptyObject(test)).toBe(false)
})

test('toLogValue', () => {
  expect(toLogValue({})).toBe('{}')
  expect(toLogValue([])).toBe('[]')
  expect(toLogValue(1)).toBe('1')
  expect(toLogValue(Symbol('foo'))).toBe('Symbol(foo)')
  expect(toLogValue(new Function('console.log(1)'))).toBe(
    `
function anonymous(
) {
console.log(1)
}`.trim(),
  )
  expect(toLogValue(1e5)).toBe('100000')
  expect(toLogValue(BigInt(1))).toBe('1')
})
