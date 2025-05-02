import { expect, test } from 'vitest'
import remarkRunnerPlugin from '~/markdown/plugins/remark/runner'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../../elements'
import { render, screen, waitFor } from '@testing-library/react'

test('generic components: code-runner', async () => {
  const code = `
console.log('start')
console.log(111)`.trim()
  const markdown = `
\`\`\`ts Run
${code}
\`\`\`
`
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkRunnerPlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  const codeDom = screen.getByRole('code')
  expect(codeDom.textContent).toBe(code)
  await waitFor(
    () => {
      const startDom = screen.getByText('start')
      expect(startDom.nextSibling?.textContent).toBe('String')
      const endDom = screen.getByText('111')
      expect(endDom.nextSibling?.textContent).toBe('Number')
    },
    {
      timeout: 100,
    },
  )
})
