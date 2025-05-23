import { describe, test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import remarkFileTreePlugin from '../../remark/code/file-tree/file-tree'
import rehypeElementPlugin from '../../rehype/elements'
import { fireEvent, render, screen } from '@testing-library/react'
import fileTreeDataRawMap from '~/markdown/config/file-tree'

describe('componets: file-tree', () => {
  const transform = async (markdown: string) => {
    const node = await transformCodeWithOptions(markdown, {
      remark: [remarkFileTreePlugin],
      rehype: [rehypeElementPlugin],
    })
    return node
  }
  test('no-preview', async () => {
    const markdown = `
\`\`\`Tree open
- +markdown
  - +plugins
    - remark.ts
    - rehype.ts
  - utils.ts
- +utils.ts
- +package.json
- .gitignore
\`\`\`
`
    const node = await transform(markdown)
    render(node)
    const labels = await screen.findAllByTestId('file-tree-label')
    expect(labels.length).toBe(8)
  })
  test('id', async () => {
    const markdown = `
\`\`\`Tree id="demo" title="Demo App" open
- +markdown
  - -plugins
    - remark.ts
    - rehype.ts
  - utils.ts
- +utils.ts
- +package.json
- .gitignore
\`\`\`
`
    const node = await transform(markdown)
    render(node)
    // tabs
    let tabs = await screen.findAllByTestId('code-tab')
    expect(tabs.length).toBe(2)
    expect(tabs[0].textContent).toBe('utils.ts')
    expect(tabs[1].textContent).toBe('package.json')
    // utils.ts content
    let code = screen.getByRole('code')
    expect(code.textContent).toBe(fileTreeDataRawMap.demo['utils.ts'])
    // click package.json
    fireEvent.click(tabs[1])
    code = await screen.findByRole('code')
    expect(code.textContent).toBe(fileTreeDataRawMap.demo['package.json'])
    // click plugins dir
    const pluginsLabel = screen.getByText('plugins')
    fireEvent.click(pluginsLabel)
    const remarkLabel = await screen.findByText('remark.ts')
    expect(remarkLabel).toBeDefined()
    const rehypeLabel = await screen.findByText('rehype.ts')
    expect(rehypeLabel).toBeDefined()
    // click remark.ts
    fireEvent.click(remarkLabel)
    code = await screen.findByRole('code')
    expect(code.textContent).toBe(
      fileTreeDataRawMap.demo.markdown.plugins['remark.ts'],
    )

    // close
    const closeBtns = screen.getAllByTestId('code-tab-close')
    for (const btn of closeBtns) {
      fireEvent.click(btn)
    }
    tabs = screen.queryAllByTestId('code-tab')
    expect(tabs.length).toBe(0)

    // click utils.ts and markdown/utils.ts
    const utilsLabels = screen.getAllByText('utils.ts')
    for (const label of utilsLabels) {
      fireEvent.click(label)
    }
    tabs = screen.queryAllByTestId('code-tab')
    expect(tabs.length).toBe(2)
    const contents = tabs.map((tab) => tab.textContent)
    expect(contents.includes('utils.ts..\\markdown')).toBe(true)
    expect(contents.includes('utils.ts..\\')).toBe(true)
  })

  test('lang', async () => {
    const utilsCode = `
export const isString = (x: unkown): x is string {
  return typeof x === 'string'
}
`.trim()
    const indexCode = `
export * from './src/utils'
`.trim()
    const markdown = `
\`\`\`ts Tree
//@tab index.ts
${indexCode}
//@tab +src/+utils.ts line
${utilsCode}
//@tab types.ts
export type TestString = string
\`\`\`
`
    const node = await transform(markdown)
    render(node)
    // labels
    const labels = await screen.findAllByTestId('file-tree-label')
    expect(labels.length).toBe(4)
    // tabs
    let tabs = await screen.findAllByTestId('code-tab')
    expect(tabs.length).toBe(1)
    expect(tabs[0].textContent).toBe('utils.ts')
    // utils.ts content
    let code = screen.getByRole('code')
    expect(code.textContent).toBe(utilsCode)
    // click types.ts
    const typesLabel = await screen.findByText('types.ts')
    fireEvent.click(typesLabel)
    // close
    const closeBtns = screen.getAllByTestId('code-tab-close')
    for (const btn of closeBtns) {
      fireEvent.click(btn)
    }
    tabs = screen.queryAllByTestId('code-tab')
    expect(tabs.length).toBe(0)
    // click index.ts
    const indexLabel = await screen.findByText('index.ts')
    fireEvent.click(indexLabel)
    code = await screen.findByRole('code')
    expect(code.textContent).toBe(indexCode)
  })
})
