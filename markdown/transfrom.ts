import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeShikiHighlight from './plugins/rehype/shiki/hightlight'
import rehypeElementPlugin from './plugins/rehype/elements'
import remarkSlug from './plugins/remark/slug'
import { remarkContainerDirectivePlugin } from './plugins/remark/directive'
import remarkRunner from './plugins/remark/runner'
import remarkCodeConfig from './plugins/remark/code'
import { remarkTextReplacePlugin } from './plugins/remark/plain-text/index'
import { markdownComponents } from './hast-components'
import remarkCodeBlcok from './plugins/remark/code-block'
import remarkHtmlParser from './plugins/remark/html-parse'
import remarkTextLink from 'remark-text-link'
import textLinkMap from './config/links'

// This code is refactored into TypeScript based on
// https://github.com/remarkjs/react-markdown/blob/main/lib/index.js
// LICENSE file: https://github.com/remarkjs/react-markdown/blob/main/license

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
      [remarkTextReplacePlugin, code],
      [remarkTextLink, textLinkMap],
      remarkHtmlParser,
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
