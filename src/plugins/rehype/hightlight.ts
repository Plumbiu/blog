// Modified by https://github.com/timlrx/rehype-prism-plus/blob/main/src/generator.js

// LICENSE: https://github.com/timlrx/rehype-prism-plus/blob/main/LICENSE
/*
  MIT License

  Copyright (c) 2021 Timothy

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Element, Root } from 'hast'
import { HighlighterCore } from 'shiki/core'
import { getCodeFromProps } from '../remark/playground'
import { isString } from '@/utils'

// This code is modified based on
// https://github.com/euank/node-parse-numeric-range/blob/master/index.js
/*
  LICENSE: https://github.com/euank/node-parse-numeric-range/blob/master/LICENSE

  Copyright (c) 2014, Euank <euank@euank.com>

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted, provided that the above
  copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
const RangeNumRegx = /^-?\d+$/
const LineRegx = /^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/
function parsePart(s: string) {
  let res = new Set()
  let m
  for (let str of s.split(',')) {
    str = str.trim()
    if (RangeNumRegx.test(str)) {
      res.add(parseInt(str, 10))
    } else if ((m = str.match(LineRegx))) {
      let [_, lhs, sep, rhs] = m as any
      if (lhs && rhs) {
        lhs = parseInt(lhs)
        rhs = parseInt(rhs)
        const incr = lhs < rhs ? 1 : -1
        if (sep === '-' || sep === '..' || sep === '\u2025') rhs += incr

        for (let i = lhs; i !== rhs; i += incr) res.add(i)
      }
    }
  }

  return res
}

// This code is modified based on
// https://github.com/timlrx/rehype-prism-plus/blob/main/src/generator.js
/*
  LICENSE: https://github.com/timlrx/rehype-prism-plus/blob/main/LICENSE

  MIT License
  
  Copyright (c) 2021 Timothy
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
const getLanguage = (className: string[]) => {
  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase()
    }
  }
  return 'txt'
}
const NumRangeRegx = /{([\d,-]+)}/
const calculateLinesToHighlight = (meta: string) => {
  const parsed = NumRangeRegx.exec(meta)
  if (parsed === null) {
    return () => false
  }
  const strlineNumbers = parsed[1]
  const lineNumbers = parsePart(strlineNumbers)
  // @ts-ignore has patched to Set<number>
  return (index: number) => lineNumbers.has(index + 1)
}

/**
 * Rehype prism plugin generator that highlights code blocks with refractor (prismjs)
 *
 * Pass in your own refractor object with the required languages registered:
 * https://github.com/wooorm/refractor#refractorregistersyntax
 */
const themeOptions = {
  light: 'vitesse-light',
  dark: 'vitesse-dark',
}
const rehypePrismGenerator = (shiki: HighlighterCore) => {
  return () => {
    return (tree: Root) => {
      visit(tree, 'element', function visitor(node, index, parent) {
        const props = node.properties
        let code = getCodeFromProps(props)?.trim()
        if (
          !parent ||
          parent.type !== 'element' ||
          parent.tagName !== 'pre' ||
          node.tagName !== 'code'
        ) {
          return
        }
        if (!code) {
          code = toString(node).trim()
        }
        // @ts-ignore meta is a custom code block property
        const meta: string = node.data?.meta ?? props?.metastring ?? ''
        // Coerce className to array
        if (props.className) {
          if (typeof props.className === 'boolean') {
            props.className = []
          } else if (!Array.isArray(props.className)) {
            props.className = [props.className]
          }
        } else {
          props.className = []
        }
        const lang = getLanguage(props.className as string[])
        props.className.push('shiki')
        // Syntax highlight
        let shikiRoot = node
        try {
          shikiRoot =
            shiki.codeToHast(code, {
              themes: themeOptions,
              lang,
              // @ts-ignore
            }).children?.[0]?.children[0] ?? node
        } catch (error) {}

        const shouldHighlightLine = calculateLinesToHighlight(meta)

        const elementChildren = shikiRoot.children.filter(
          (elm) => elm.type === 'element' && isString(elm.properties.class),
        )
        const shouldAddNumber = meta
          .toLowerCase()
          .includes('showLineNumbers'.toLowerCase())
        for (let i = 0; i < elementChildren.length; i++) {
          const line = elementChildren[i] as Element
          const lineProps = line.properties
          const className = lineProps.class as string
          lineProps.class = [className]

          if (shouldAddNumber) {
            lineProps.line = [(i + 1).toString()]
          }
          if (shouldHighlightLine(i)) {
            lineProps.class.push('highlight-line')
          }
          // Diff classes
          if (lang === 'diff' || lang.includes('diff-')) {
            const ch = toString(line).substring(0, 1)
            lineProps.class.push(ch === '-' ? 'deleted' : 'inserted')
          }
        }
        node.children = shikiRoot.children
      })
    }
  }
}

export default rehypePrismGenerator
