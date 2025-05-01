import { describe, expect, test } from 'vitest'
import { transformCodeWithOptions } from '~/markdown/transfrom'
import rehypeElementPlugin from '../elements'
import { render, screen } from '@testing-library/react'
import { BlockquoteSvgElementPathMap } from '../elements/blockquote'
import { mono } from '@/app/fonts'

describe('rehype: elements', () => {
  const transform = (markdown: string) => {
    return transformCodeWithOptions(markdown, {
      remark: [],
      rehype: [rehypeElementPlugin],
    })
  }
  test('a', async () => {
    const markdown = '[hello]("blog.plumbiu.com")'
    const node = await transform(markdown)
    render(node)
    const dom = screen.getByRole('link')
    expect(dom.getAttribute('target')).toBe('_blank')
    expect(dom.getAttribute('rel')).toBe('noreferrer')
  })

  test('blockquote', async () => {
    const markdown = `
> [!NOTE] Custom
> Value
`
    const node = await transform(markdown)
    const { container } = render(node)
    /*
    <blockquote>
      <p>
        <span className="blockquote-title" data-alert-type="note">
          <svg viewBox="xxx" aria-hidden="true">
            <path d="xxx" />
          </svg>
          NOTE
        </span>
      </p>
    </blockquote>
  */
    const blockquote = container.querySelector('blockquote')
    expect(blockquote?.textContent?.trim()).toBe('Custom\nValue')
    const titleDom = container.querySelector('.blockquote-title') // <span></span>
    expect(titleDom?.getAttribute('data-alert-type')).toBe('note')
    const svgDom = container.querySelector('svg')
    expect(svgDom?.getAttribute('viewBox')).toBe('0 0 16 16')
    expect(svgDom?.getAttribute('aria-hidden')).toBe('true')

    const pathDom = container.querySelector('path')
    expect(pathDom?.getAttribute('d')).toBe(BlockquoteSvgElementPathMap.note)
  })

  test('code', async () => {
    const markdown = '```ts\nconsole.log(111)\n```'
    const node = await transform(markdown)
    render(node)
    const dom = screen.getByRole('code')
    expect(dom.classList.contains(mono.className)).toBe(true)
  })
})
