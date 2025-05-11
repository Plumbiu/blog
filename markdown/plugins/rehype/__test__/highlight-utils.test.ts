import { describe, expect, test } from 'vitest'
import { getLanguage } from '../shiki/highlight-utils'

describe('rehype: highlight-utils', () => {
  test('getLanuage', () => {
    expect(getLanguage()).toBe('txt')
    expect(getLanguage('language-ts')).toBe('ts')
    expect(getLanguage([1, true, Symbol('language-ts'), 'language-ts'])).toBe(
      'ts',
    )
    expect(getLanguage([1, true, Symbol('language-ts')])).toBe('txt')
  })
})
