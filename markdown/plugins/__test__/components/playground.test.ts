import { test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../../rehype/elements'
import { fireEvent, render, screen } from '@testing-library/react'
import remarkCodeComponentsPlugin from '../../remark/code-block/components'

test('components: playground', async () => {
  const AppCode = `
import Child from './Child'
export default function App() {
  console.log('app')
  return <Child />
}
`.trim()
  const childCode = `
export default function Child() {
  return <h1 onClick={() => console.log('child')}>this is child</h1>
}
`.trim()
  const cssCode = `
h1 {
  color: red;
}
`.trim()
  const code = `
/// App.jsx
${AppCode}
/// Child.tsx
${childCode}
/// App.css
${cssCode}
`.trim()
  const markdown = `
\`\`\`tsx Playground
${code}
\`\`\`
`
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkCodeComponentsPlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  const tabsDom = screen.getAllByTestId('code-tab')
  expect(tabsDom[0].textContent).toBe('App.jsx')
  expect(tabsDom[1].textContent).toBe('Child.tsx')
  expect(tabsDom[2].textContent).toBe('App.css')

  let codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(AppCode)
  fireEvent.click(tabsDom[1])
  codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(childCode)
  fireEvent.click(tabsDom[2])
  codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(cssCode)
})
