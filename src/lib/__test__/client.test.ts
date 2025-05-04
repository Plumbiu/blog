import { expect, test } from 'vitest'
import { cn, renderReactNodeToString } from '../client'
import { createElement } from 'react'
import { isNumber, isString } from '../types'

test('cn', () => {
  const className = cn('a', 'b', { c: true, d: false }, 1, 2, true, false)
  expect(cn(className)).toBe('a b c 1 2')
})
test('renderReactNodeToString', () => {
  const words = ['example', 'hello', 'world', 'hello', 'world', 'hello']
  let i = 0
  const h = (...args: Parameters<typeof createElement>) => {
    const children = args[2]
    if (isString(children) || isNumber(children)) {
      return createElement(args[0], args[1], words[i++])
    }
    return createElement(...args)
  }
  const node = h('div', null, [
    h('a', null, 0),
    h('div', null, [h('span', null, 1), h('span', null, 2)]),
    h('div', null, [
      h('span', null, 3),
      h('div', null, [h('span', null, 4), h('div', null, 5)]),
    ]),
  ])
  const string = renderReactNodeToString(node)
  expect(string).toBe(words.join(''))
})
