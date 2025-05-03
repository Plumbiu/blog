import { test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { render, screen } from '@testing-library/react'
import remarkHtmlParser from '~/markdown/plugins/remark/html-parse'

test('components: pre-title', async () => {
  const markdown = '<ExtensionTest />'
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkHtmlParser],
    rehype: [],
  })
  render(node)
  const dom = await screen.findByRole('deletion')
  expect(dom.textContent).toBe('ExtensionText')
})
