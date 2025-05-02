import { describe, expect, test } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { render, screen } from '@testing-library/react'
import {
  DiffDeletedClassName,
  DiffInsertedClassName,
  HighLightLineClassName,
  HighLightWordClassName,
  HighLightWordEndClassName,
  HighLightWordStartClassName,
} from '../shiki/highlight-utils'
import rehypeShikiPlugin from '../shiki/hightlight'

describe('rehype: shiki', () => {
  const transform = (markdown: string) => {
    return transformCodeWithOptions(markdown, {
      remark: [],
      rehype: [rehypeShikiPlugin],
    })
  }
  test('highlight: word', async () => {
    const markdown = `
\`\`\`ts /log/
// [!code word:console]
console.log(111)
console.log(222)
\`\`\`
`
    const node = await transform(markdown)
    render(node)
    const consoleDoms = screen.getAllByText('console')
    expect(
      consoleDoms.every((item) =>
        item.classList.contains(HighLightWordClassName),
      ),
    ).toBe(true)
    const logDoms = screen.getAllByText('log')
    expect(
      logDoms.every((item) => item.classList.contains(HighLightWordClassName)),
    ).toBe(true)
  })
  test('highlight: word start and end className', async () => {
    const markdown = `
\`\`\`js /.log/
// [!code word:console]
console.log(msg)
\`\`\`
`
    const node = await transform(markdown)
    const { container } = render(node)
    const doms = container.querySelectorAll(
      `span[class*="${HighLightWordClassName}"]`,
    )
    expect(doms[0].classList.contains(HighLightWordStartClassName)).toBe(true)
    expect(
      doms[doms.length - 1].classList.contains(HighLightWordEndClassName),
    ).toBe(true)
  })

  test('highlight: line', async () => {
    const markdown = `
\`\`\`ts {1,3}
console.log('1')
console.log('2')
console.log('3')
console.log('4') // [!code highlight]
console.log('5')
\`\`\`
`
    const node = await transform(markdown)
    const { container } = render(node)
    const codeElm = container.querySelectorAll('code > span')
    expect(codeElm[0].classList.contains(HighLightLineClassName)).toBe(true)
    expect(codeElm[2].classList.contains(HighLightLineClassName)).toBe(true)
    expect(codeElm[3].classList.contains(HighLightLineClassName)).toBe(true)
  })

  test('diff', async () => {
    const markdown = `
\`\`\`diff-ts
console.log('1') // [!code --]
-console.log('2')
+console.log('3')
console.log('4') // [!code ++]
+console.log('5')
\`\`\`
`
    const node = await transform(markdown)
    const { container } = render(node)
    const codeElm = container.querySelectorAll('code > span')
    expect(codeElm[0].classList.contains(DiffDeletedClassName)).toBe(true)
    expect(codeElm[1].classList.contains(DiffDeletedClassName)).toBe(true)
    expect(codeElm[2].classList.contains(DiffInsertedClassName)).toBe(true)
    expect(codeElm[3].classList.contains(DiffInsertedClassName)).toBe(true)
    expect(codeElm[4].classList.contains(DiffInsertedClassName)).toBe(true)
  })
})
