import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeShikiHighlight from '@/plugins/rehype/shiki/hightlight'
import rehypeElementPlugin from '@/plugins/rehype/element'
import remarkSlug from '@/plugins/remark/slug'
import { remarkContainerDirectivePlugin } from '@/plugins/remark/directive'
import remarkRunner from '@/plugins/remark/runner'
import remarkImage from '@/plugins/remark/image'
import remarkCodeConfig from '@/plugins/remark/code'
import { remarkPlainText } from '@/plugins/remark/plain-text/index'
import { markdownComponents } from './components'
import remarkCodeBlcok from '@/plugins/remark/code-block'

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
  const processor = unified()
    .use(remarkParse)
    .use([
      remarkGfm,
      remarkDirective,
      remarkContainerDirectivePlugin,
      remarkSlug,
      remarkCodeConfig,
      remarkCodeBlcok,
      remarkRunner,
      remarkImage,
      [remarkPlainText, code],
    ])
    .use(remarkRehype)
    .use([rehypeElementPlugin, rehypeShikiHighlight])
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
