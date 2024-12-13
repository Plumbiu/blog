import { type Root, Element } from 'hast'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { HighlighterCore } from 'shiki/core'
import { shikiClassTransformer } from 'shiki-class-transformer'
import {
  transformerNotationWordHighlight,
  transformerNotationHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import shikiMap from 'shiki-class-transformer/themes/vitesse-light.json'
import { isString } from '@/utils/types'
import { calculateLinesToHighlight, parsePart } from './highlight-utils'

const getLanguage = (className: any) => {
  if (!Array.isArray(className)) {
    className = [className]
  }
  for (const classListItem of className) {
    if (isString(classListItem)) {
      if (classListItem.slice(0, 9) === 'language-') {
        return classListItem.slice(9).toLowerCase()
      }
    }
  }
  return 'txt'
}

const themeOptions = {
  light: 'vitesse-light',
  dark: 'vitesse-dark',
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
const HightLightWordRegx = /\/(.+)\//
const rehypePrismGenerator = (shiki: HighlighterCore) => {
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
      const lang = getLanguage(props.className)
      const shouldHighlightLine = calculateLinesToHighlight(meta)
      const [_, highlightWord] = HightLightWordRegx.exec(meta) ?? []
      const shouldAddNumber = meta.includes('line')
      // Syntax highlight
      let shikiRoot = node
      try {
        shikiRoot =
          shiki.codeToHast(code, {
            themes: themeOptions,
            lang: lang.replace('diff-', ''),
            transformers: [
              shikiClassTransformer({
                map: shikiMap,
                deletedKeys: ['--shiki-dark'],
              }),
              {
                line(node, line) {
                  const str = toString(node)
                  if (highlightWord) {
                    const hightlightWordIndex = str.indexOf(highlightWord)
                    if (hightlightWordIndex !== -1) {
                      let count = 0
                      const nodes: Element[] = []
                      for (const child of node.children) {
                        if (child.type !== 'element') {
                          continue
                        }
                        const childStr = toString(child)
                        const endIndex =
                          hightlightWordIndex + highlightWord.length
                        if (
                          highlightWord.includes(childStr) &&
                          count >= hightlightWordIndex &&
                          count < endIndex
                        ) {
                          nodes.push(child)
                        }
                        count += childStr.length
                      }
                      const nodeLength = nodes.length
                      for (let i = 0; i < nodeLength; i++) {
                        const node = nodes[i]
                        this.addClassToHast(node, 'highlight-word')
                        if (nodeLength !== 1) {
                          if (i === 0) {
                            this.addClassToHast(node, 'highlight-word-start')
                          } else if (i === nodeLength - 1) {
                            this.addClassToHast(node, 'highlight-word-end')
                          }
                        }
                      }
                    }
                  }
                  if (shouldAddNumber) {
                    node.properties['data-line'] = line
                  }
                  if (shouldHighlightLine(line - 1)) {
                    this.addClassToHast(node, 'highlight-line')
                  }
                  if (lang.startsWith('diff-')) {
                    const ch = str.substring(0, 1)
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
              transformerNotationWordHighlight({
                classActiveWord: 'highlight-word',
              }),
              transformerNotationHighlight({
                classActiveLine: 'highlight-line',
              }),
              transformerNotationDiff({
                classLineAdd: 'inserted symbol',
                classLineRemove: 'deleted symbol',
              }),
            ],
            // @ts-ignore
          }).children?.[0]?.children[0] ?? node
      } catch (error) {}

      node.children = shikiRoot.children
      return 'skip'
    })
  }
}

export default rehypePrismGenerator
