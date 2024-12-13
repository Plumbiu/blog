import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import getWasm from 'shiki/wasm'
import { getSingletonHighlighterCore } from 'shiki/core'
import rehypePrismGenerator from '@/plugins/rehype/hightlight'
import rehypeElementPlugin from '@/plugins/rehype/element'
import remarkSlug from '@/plugins/remark/slug'
import remarkPlayground from '@/plugins/remark/playground'
import { remarkContainerDirectivePlugin } from '@/plugins/remark/directive'
import remarkRunner from '@/plugins/remark/runner'
import remarkImage from '@/plugins/remark/image'
import remarkCodeConfig from '@/plugins/remark/code'
import { remarkVarInject } from '@/plugins/remark/var-inject'
import { markdownComponents } from './components'

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

// This code is refactored into TypeScript based on
// https://github.com/remarkjs/react-markdown/blob/main/lib/index.js
/*
  LICENSE: https://github.com/remarkjs/react-markdown/blob/main/license

  The MIT License (MIT)

  Copyright (c) Espen Hovlandsdal

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

async function transfromCode2Jsx(code: string) {
  const shiki = await getSingletonHighlighterCore(shikiOptions)
  const processor = unified()
    .use(remarkParse)
    .use([
      remarkGfm,
      remarkDirective,
      remarkContainerDirectivePlugin,
      remarkSlug,
      remarkCodeConfig,
      remarkPlayground,
      remarkRunner,
      remarkImage,
      [remarkVarInject, code],
    ])
    .use(remarkRehype)
    .use([rehypeElementPlugin, [rehypePrismGenerator, shiki]])
  const mdastTree = processor.parse(code)
  const hastTree = await processor.run(mdastTree)

  const node = toJsxRuntime(hastTree, {
    Fragment,
    components: markdownComponents,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  })
  return node
}

export default transfromCode2Jsx
