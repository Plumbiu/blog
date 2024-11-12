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
import { type Root } from 'hast'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { HighlighterCore } from 'shiki/core'
// import shikiMap from '@/shiki-map.json'
import { shikiClassTransformer } from 'shiki-class-transformer'
import shikiMap from 'shiki-class-transformer/themes/vitesse-light.json'
import { isNumber, isString } from '@/utils'

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

const NumRangeRegx = /{([\d,-]+)}/
const calculateLinesToHighlight = (meta: string) => {
  const parsed = NumRangeRegx.exec(meta)
  if (parsed === null) {
    return () => false
  }
  const strlineNumbers = parsed[1]
  const lineNumbers = parsePart(strlineNumbers)
  return (index: number) => lineNumbers.has(index + 1)
}

const getLanguage = (className: (string | number)[]) => {
  for (const classListItem of className) {
    if (isString(classListItem)) {
      if (classListItem.slice(0, 9) === 'language-') {
        return classListItem.slice(9).toLowerCase()
      }
    }
  }
  return 'txt'
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
      visit(tree, 'element', (node, index, parent) => {
        if (
          !parent ||
          parent.type !== 'element' ||
          parent.tagName !== 'pre' ||
          node.tagName !== 'code'
        ) {
          return
        }
        const props = node.properties
        const data = node.data
        const code = toString(node).trim()
        const meta = (data?.meta ?? '') as string
        if (!props.className || typeof props.className === 'boolean') {
          props.className = []
        } else if (isString(props.className) || isNumber(props.className)) {
          props.className = [props.className]
        }
        const lang = getLanguage(props.className)
        props.className.push('shiki')
        const shouldHighlightLine = calculateLinesToHighlight(meta)
        const shouldAddNumber = meta.includes('line')
        // Syntax highlight
        let shikiRoot = node
        try {
          shikiRoot =
            shiki.codeToHast(code, {
              themes: themeOptions,
              lang: lang.replace('diff-', ''),
              transformers: [
                shikiClassTransformer({ map: shikiMap, dev: true }),
                {
                  line(node, line) {
                    if (shouldAddNumber) {
                      node.properties['data-line'] = line
                    }
                    if (shouldHighlightLine(line - 1)) {
                      this.addClassToHast(node, 'highlight-line')
                    }
                    if (lang.startsWith('diff-')) {
                      const ch = toString(node).substring(0, 1)
                      if (ch !== '-' && ch !== '+') {
                        return
                      }
                      this.addClassToHast(
                        node,
                        ch === '-' ? 'deleted' : 'inserted',
                      )
                    }
                  },
                },
              ],
              // @ts-ignore
            }).children?.[0]?.children[0] ?? node
        } catch (error) {}

        node.children = shikiRoot.children
      })
    }
  }
}

export default rehypePrismGenerator
