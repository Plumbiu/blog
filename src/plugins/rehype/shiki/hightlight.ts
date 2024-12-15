import { type Root } from 'hast'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { getSingletonHighlighterCore } from 'shiki/core'
import { shikiClassTransformer } from 'shiki-class-transformer'
import {
  transformerNotationWordHighlight,
  transformerNotationHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import shikiMap from 'shiki-class-transformer/themes/vitesse-light.json'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import getWasm from 'shiki/wasm'
import {
  customShikiTranformer,
  shikiHightlightWordFormatTransformer,
} from './transformer'
import {
  getLanguage,
  HighLightWordClassName,
  HighLightLineClassName,
  DiffInsertedClassName,
  DiffDeletedClassName,
} from '../highlight-utils'

const shikiOptions = {
  themes: [vitesseDark, vitesseLight],
  engine: createOnigurumaEngine(getWasm),
  langs: [
    import('shiki/langs/js.mjs'),
    import('shiki/langs/jsx.mjs'),
    import('shiki/langs/tsx.mjs'),
    import('shiki/langs/ts.mjs'),
    import('shiki/langs/css.mjs'),
    import('shiki/langs/css.mjs'),
    import('shiki/langs/rust.mjs'),
    import('shiki/langs/vue.mjs'),
    import('shiki/langs/json.mjs'),
    import('shiki/langs/json5.mjs'),
    import('shiki/langs/yaml.mjs'),
    import('shiki/langs/go.mjs'),
    import('shiki/langs/html.mjs'),
    import('shiki/langs/html-derivative.mjs'),
    import('shiki/langs/xml.mjs'),
    import('shiki/langs/regex.mjs'),
    import('shiki/langs/less.mjs'),
    import('shiki/langs/shell.mjs'),
    import('shiki/langs/bash.mjs'),
    import('shiki/langs/git-commit.mjs'),
    import('shiki/langs/git-rebase.mjs'),
    import('shiki/langs/regexp.mjs'),
    import('shiki/langs/markdown.mjs'),
    import('shiki/langs/markdown-vue.mjs'),
    import('shiki/langs/c.mjs'),
    import('shiki/langs/cpp.mjs'),
  ],
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
const rehypeShikiHighlight = () => {
  return async (tree: Root) => {
    const shiki = await getSingletonHighlighterCore(shikiOptions)
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
              customShikiTranformer({
                meta,
                lang,
              }),
              transformerNotationWordHighlight({
                classActiveWord: HighLightWordClassName,
              }),
              transformerNotationHighlight({
                classActiveLine: HighLightLineClassName,
              }),
              transformerNotationDiff({
                classLineAdd: DiffInsertedClassName,
                classLineRemove: DiffDeletedClassName,
              }),
              shikiHightlightWordFormatTransformer(),
            ],
            // @ts-ignore
          }).children?.[0]?.children[0] ?? node
      } catch (error) {}

      node.children = shikiRoot.children
      return 'skip'
    })
  }
}

export default rehypeShikiHighlight
