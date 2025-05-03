import { test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../../elements'
import remarkCodeBlcokPlugin from '~/markdown/plugins/remark/code-block'
import { render, screen, waitFor } from '@testing-library/react'

test('components: switcher', async () => {
  const tab1Code = "console.log('tab1')"
  const tab2Code = "console.log('tab2')"
  const code = `
/// tab1
${tab1Code}
/// tab2
${tab2Code}
`.trim()
  const markdown = `
\`\`\`ts Switcher 
${code}
\`\`\`
`
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkCodeBlcokPlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  let codeDom = screen.getByRole('code')
  expect(codeDom.textContent).toBe(tab1Code)
  const tab2Button = screen.getByText('tab2')
  tab2Button.click()
  await waitFor(() => {
    codeDom = screen.getByRole('code')
    expect(codeDom.textContent).toBe(tab2Code)
  })
})
