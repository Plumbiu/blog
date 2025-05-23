import { expect, test } from 'vitest'
import remarkRunnerPlugin from '~/markdown/plugins/remark/logger'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../../rehype/elements'
import { fireEvent, render, screen } from '@testing-library/react'

test('components: code-runner', async () => {
  const code = `
console.log('start')
console.log(111)`.trim()
  const markdown = `
\`\`\`ts Log
${code}
\`\`\`
`
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkRunnerPlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  const codeDom = screen.getByRole('code')
  const testPrint = async () => {
    const startDom = await screen.findByText('start')
    expect(startDom.nextSibling?.textContent).toBe('String')
    const endDom = await screen.findByText('111')
    expect(endDom.nextSibling?.textContent).toBe('Number')
  }
  expect(codeDom.textContent).toBe(code)
  await testPrint()
  const button = screen.getByTestId('force-update-btn')
  fireEvent.click(button)
  await testPrint()
})
