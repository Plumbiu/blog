import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import remarkCodeBlcokPlugin from '../code-block'

describe('remark: code-block', () => {
  const transform = (markdown: string) => {
    return transformCodeWithOptions(markdown, {
      remark: [remarkCodeBlcokPlugin],
      rehype: [],
    })
  }

  test('language', async () => {
    const markdown = `
\`\`\`ts

\`\`\`
`
    const node = await transform(markdown)
    render(node)
    const dom = screen.getByRole('code')
    expect(dom.classList.contains('language-ts')).toBe(true)
  })

  test('meta: path local', async () => {
    const componentPath = 'ExtensionTest.tsx'
    const componentCode = await readFile(
      path.join(process.cwd(), 'markdown', 'components', componentPath),
      'utf-8',
    )
    const node = await transform(`
\`\`\`tsx path="${componentPath}"

\`\`\`
`)
    render(node)
    const dom = screen.getByRole('code')
    expect(dom.textContent).toEqual(componentCode)
  })

  test.skip('meta: path remote', async () => {
    const remotePath =
      'https://gist.githubusercontent.com/Plumbiu/7fc950397d9913b6f9558f7fc2c541ed/raw/4a3c95548679087f4ccd6ac032ed7aa1b1ca7e87/blog-remote-test.js'
    const temoteCode = await fetch(remotePath).then((res) => res.text())
    const node = await transform(`
\`\`\`txt path="${remotePath}"

\`\`\`
`)
    render(node)
    const dom = screen.getByRole('code')
    expect(dom.textContent).toEqual(temoteCode)
  })
})
