import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import remarkSlugPlugin from '../slug'

const markdown = `
# Hello

content

# 中文 Hello

# inline code \`Hello\`

`

test('reamrk: slug', async () => {
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkSlugPlugin],
    rehype: [],
  })
  render(node)
  const dom = screen.getAllByRole('heading')
  const ids = dom.map((item) => item.id)
  expect(ids).toEqual(['hello', '中文-hello', 'inline-code-hello'])
})
