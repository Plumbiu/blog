import { test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { render, screen, waitFor } from '@testing-library/react'
import remarkHtmlParser from '~/markdown/plugins/remark/html-parse'
import { readFile } from 'node:fs/promises'

test('components: pre-title', async () => {
  const code = await readFile(
    './markdown/components/ExtensionTest.tsx',
    'utf-8',
  )
  const markdown = '<ExtensionTest />'
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkHtmlParser],
    rehype: [],
  })
  render(node)
  await waitFor(() => {
    const dom = screen.getByRole('deletion')
    expect(dom.textContent).toBe('ExtensionText')
  })
})
