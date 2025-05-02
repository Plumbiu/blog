import { describe, expect, test } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import { render, screen } from '@testing-library/react'
import {
  HighLightWordClassName,
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
  test('word highlight', async () => {
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
    console.log(logDoms.at(-1))
    expect(
      logDoms.every((item) => item.classList.contains(HighLightWordClassName)),
    ).toBe(true)
  })
  test('word highlight startClass and endClass', async () => {
    const markdown = `
\`\`\`js /Hello/
const msg = 'Hello World'
console.log(msg)
console.log(msg) // prints Hello World
\`\`\`
`
    const node = await transform(markdown)
    render(node)
    const doms = screen.getAllByText('log(')
    console.log(doms.map((dom) => dom.textContent).join('\n'))
    expect(
      doms.every((item) => item.classList.contains(HighLightWordClassName)),
    ).toBe(true)
    expect(doms[0].classList.contains(HighLightWordStartClassName)).toBe(true)
    expect(
      doms[doms.length - 1].classList.contains(HighLightWordStartClassName),
    ).toBe(true)
  })
})
