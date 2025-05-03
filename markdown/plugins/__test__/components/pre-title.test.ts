import { test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../../rehype/elements'
import { render, screen } from '@testing-library/react'
import remarkCodeTitlePlugin from '~/markdown/plugins/remark/code-block/title'

test('components: pre-title', async () => {
  const code = `
console.log('start')
console.log('end')  
`.trim()
  const markdown = `
\`\`\`ts title="test-title" 
${code}
\`\`\`
`
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkCodeTitlePlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  const codeDom = screen.getByRole('code')
  expect(codeDom.textContent).toBe(code)
  const titleDom = screen.getByText('test-title')
  expect(titleDom).toBeDefined()
})
