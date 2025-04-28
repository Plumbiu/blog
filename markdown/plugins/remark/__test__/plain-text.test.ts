import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { remarkPlainTextPlugin } from '../plain-text'
import emojiMap from '~/markdown/config/emoji'
import variableMap from '~/markdown/config/variables'

describe('remark: plain-text', () => {
  const transform = (markdown: string, code: string) => {
    return transformCodeWithOptions(markdown, {
      remark: [[remarkPlainTextPlugin, code]],
      rehype: [],
    })
  }
  test('emoji', async () => {
    const smileEmoji = emojiMap.smile
    const markdown = 'smile emoji :smile: end'
    const node = await transform(markdown, markdown)
    render(node)
    const dom = screen.getByRole('paragraph')
    expect(dom.textContent).toBe(`smile emoji ${smileEmoji} end`)
  })

  test('variable', async () => {
    const varText = JSON.stringify(variableMap.bar.test)
    const markdown = "variable {{bar['test']}} end"
    const node = await transform(markdown, markdown)
    render(node)
    const dom = screen.getByRole('paragraph')
    expect(dom.textContent).toBe(`variable ${varText} end`)
  })
})
