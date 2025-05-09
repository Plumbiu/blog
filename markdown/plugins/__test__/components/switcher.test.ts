import { test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../../rehype/elements'
import { fireEvent, render, screen } from '@testing-library/react'
import remarkCodeComponentsPlugin from '../../remark/code/components'

test('components: switcher', async () => {
  const tab1Code = "console.log('tab1')"
  const tab2Code = "console.log('tab2')"
  const code = `
//@tab tab1
${tab1Code}
//@tab tab2
${tab2Code}
`.trim()
  const markdown = `
\`\`\`ts Switcher 
${code}
\`\`\`
`
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkCodeComponentsPlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  let codeDom = screen.getByRole('code')
  expect(codeDom.textContent).toBe(tab1Code)
  const tab2Button = screen.getByText('tab2')
  fireEvent.click(tab2Button)
  codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(tab2Code)
})
