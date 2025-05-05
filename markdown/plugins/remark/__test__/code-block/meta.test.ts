import { expect, test, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import remarkCodeMetaPlugin from '../../code/meta'
import rehypeElementPlugin from '~/markdown/plugins/rehype/elements'
import remarkCodeComponentsPlugin from '../../code/components'

describe('remark: code-block-meta', async () => {
  const transform = (markdown: string) => {
    return transformCodeWithOptions(markdown, {
      remark: [remarkCodeMetaPlugin, remarkCodeComponentsPlugin],
      rehype: [rehypeElementPlugin],
    })
  }
  const ExtensionTestComponentPath = 'ExtensionTest.tsx'
  const ExtensionTextComponentCode = await readFile(
    path.join(
      process.cwd(),
      'markdown',
      'components',
      ExtensionTestComponentPath,
    ),
    'utf-8',
  )
  test('path local', async () => {
    const node = await transform(`
\`\`\`tsx path="${ExtensionTestComponentPath}"

\`\`\`
`)
    render(node)
    const dom = screen.getByRole('code')
    expect(dom.textContent).toEqual(ExtensionTextComponentCode)
  })

  test.skip('path remote', async () => {
    const remotePath =
      'https://gist.githubusercontent.com/Plumbiu/7fc950397d9913b6f9558f7fc2c541ed/raw/4a3c95548679087f4ccd6ac032ed7aa1b1ca7e87/blog-remote-test.js'
    const temoteCode = await fetch(remotePath).then((res) => res.text())
    const node = await transform(`
\`\`\`txt path="${remotePath}"

\`\`\``)
    render(node)
    const dom = screen.getByRole('code')
    expect(dom.textContent).toEqual(temoteCode)
  })

  test('component', async () => {
    const markdown = `
\`\`\`tsx Playground component="ExtensionTest" path="ExtensionTest"

\`\`\`
`
    const node = await transform(markdown)
    render(node)
    const consoleDom = screen.getByRole('code')
    expect(consoleDom.textContent).toEqual(ExtensionTextComponentCode.trim())
    const delDom = await screen.findByRole('deletion')
    expect(delDom.textContent).toEqual('ExtensionText')
  })
})
