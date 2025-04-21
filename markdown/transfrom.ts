import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeShikiHighlight from '~/markdown/plugins/rehype/shiki/hightlight'
import rehypeElementPlugin from '~/markdown/plugins/rehype/element'
import remarkSlug from '~/markdown/plugins/remark/slug'
import { remarkContainerDirectivePlugin } from '~/markdown/plugins/remark/directive'
import remarkRunner from '~/markdown/plugins/remark/runner'
import remarkCodeConfig from '~/markdown/plugins/remark/code'
import { remarkPlainText } from '~/markdown/plugins/remark/plain-text/index'
import { markdownComponents } from './hast-components'
import remarkCodeBlcok from '~/markdown/plugins/remark/code-block'
import remarkHtmlParser from './plugins/remark/html-parse'

// This code is refactored into TypeScript based on
// https://github.com/remarkjs/react-markdown/blob/main/lib/index.js
// LICENSE file: https://github.com/remarkjs/react-markdown/blob/main/license

async function transfromCode2Jsx(code: string) {
  const processor = unified()
    .use(remarkParse)
    .use([
      remarkGfm,
      remarkMath,
      remarkDirective,
      remarkContainerDirectivePlugin,
      remarkSlug,
      remarkCodeConfig,
      remarkCodeBlcok,
      remarkRunner,
      [remarkPlainText, code],
      remarkHtmlParser,
    ])
    .use(remarkRehype)
    .use([rehypeKatex, rehypeElementPlugin, rehypeShikiHighlight])
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
