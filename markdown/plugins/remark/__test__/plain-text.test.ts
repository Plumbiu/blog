import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { remarkPlainTextPlugin } from '../plain-text'
import emojiMap from '~/markdown/config/emoji'
import variableMap from '~/markdown/config/variables'

describe('remark: plain-text', () => {
  const transfrom = (markdown: string, code: string) => {
    return transformCodeWithOptions(markdown, {
      remark: [[remarkPlainTextPlugin, code]],
      rehype: [],
    })
  }
  test('reamrk: emoji', async () => {
    const smileEmoji = emojiMap.smile
    const code = 'smile emoji :smile: end'
    const node = await transfrom(code, code)
    render(node)
    const dom = screen.getByRole('paragraph')
    expect(dom.textContent).toBe(`smile emoji ${smileEmoji} end`)
  })

  test('remark: variable', async () => {
    const varText = JSON.stringify(variableMap.bar.test)
    const code = "variable {{bar['test']}} end"
    const node = await transfrom(code, code)
    render(node)
    const dom = screen.getByRole('paragraph')
    expect(dom.textContent).toBe(`variable ${varText} end`)
  })
})
