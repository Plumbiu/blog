import { test, expect } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../../rehype/elements'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import remarkCodeComponentsPlugin from '../../remark/code/components'
import {
  renderPlayground,
  renderStaticPlayground,
} from '~/markdown/components/generic/playground/compile'
import {
  handleComponentDefaultSelectorKey,
  handleFileMap,
} from '../../constant'
import { createElement } from 'react'

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

test('components: playground', async () => {
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkCodeComponentsPlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  const tabsDom = screen.getAllByTestId('code-tab')
  expect(tabsDom[0].textContent).toBe('App.jsx')
  expect(tabsDom[1].textContent).toBe('Child.tsx')
  expect(tabsDom[2].textContent).toBe('App.css')
  let consoleTabDom = screen.getByTestId('console-tab')
  fireEvent.click(consoleTabDom)
  let consoleDataDom = await screen.findAllByTestId('console-data')
  expect(consoleDataDom[0].textContent).toBe('app')
  const previewTabDom = screen.getByTestId('preview-tab')
  fireEvent.click(previewTabDom)
  let codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(AppCode)
  fireEvent.click(tabsDom[1])
  codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(childCode)
  fireEvent.click(tabsDom[2])
  codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(cssCode)

  const refreshDom = screen.getByTestId('force-update-btn')
  fireEvent.click(refreshDom)
  consoleTabDom = await screen.findByTestId('console-tab')
  fireEvent.click(consoleTabDom)
  consoleDataDom = await screen.findAllByTestId('console-data')
  expect(consoleDataDom[0].textContent).toBe('app')
})

test('renderPlayground', async () => {
  // components: playground not work somehow
  const node = await transformCodeWithOptions(markdown, {
    remark: [remarkCodeComponentsPlugin],
    rehype: [rehypeElementPlugin],
  })
  const playgroundProps = node.props.children.props
  const logData: string[] = []

  const log = (arg: string) => {
    logData.push(arg)
  }
  const defaultSelector = handleComponentDefaultSelectorKey(playgroundProps)
  const files = handleFileMap(playgroundProps)
  const component = renderPlayground({
    files,
    logFn: { log },
    defaultSelector,
  })
  render(createElement(component))
  const heading = screen.getByRole('heading')
  expect(heading.textContent).toBe('this is child')
  fireEvent.click(heading)
  await waitFor(() => {
    expect(logData).toEqual(['app', 'child'])
  })
})
const htmlCode = `
<h1>Html code</h1>
`.trim()
const htmlCssCode = `
h1 {
  color: red;
}
`.trim()
const htmlMarkdown = `
\`\`\`html Playground
/// index.html
${htmlCode}
/// index.css
${htmlCssCode}
\`\`\``

test('components: static playground', async () => {
  const node = await transformCodeWithOptions(htmlMarkdown, {
    remark: [remarkCodeComponentsPlugin],
    rehype: [rehypeElementPlugin],
  })
  render(node)
  const tabsDom = screen.getAllByTestId('code-tab')
  expect(tabsDom[0].textContent).toBe('index.html')
  expect(tabsDom[1].textContent).toBe('index.css')
  let codeDom = screen.getByRole('code')
  expect(codeDom.textContent).toBe(htmlCode)
  fireEvent.click(tabsDom[1])
  codeDom = await screen.findByRole('code')
  expect(codeDom.textContent).toBe(htmlCssCode)
})
test('renderStaticPlayground', async () => {
  const node = await transformCodeWithOptions(htmlMarkdown, {
    remark: [remarkCodeComponentsPlugin],
    rehype: [rehypeElementPlugin],
  })
  const playgroundProps = node.props.children.props

  const defaultSelector = handleComponentDefaultSelectorKey(playgroundProps)
  const files = handleFileMap(playgroundProps)
  const component = renderStaticPlayground({
    files,
    logFn: { log: () => {} },
    defaultSelector,
  })
  render(component)
  expect(screen.getByRole('heading').textContent).toBe('Html code')
})
