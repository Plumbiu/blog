import { type PluggableList, unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeShikiHighlight from './plugins/rehype/shiki/hightlight'
import rehypeElementPlugin from './plugins/rehype/elements'
import remarkSlugPlugin from './plugins/remark/slug'
import { remarkContainerDirectivePlugin } from './plugins/remark/directive'
import remarkRunner from './plugins/remark/runner'
import { remarkPlainTextPlugin } from './plugins/remark/plain-text/index'
import { markdownComponents } from './hast-components'
import remarkCodeBlcokPlugin from './plugins/remark/code-block'
import remarkHtmlParser from './plugins/remark/html-parse'
import remarkDefinition from 'remark-definition'
import definitionMap from './config/definitions'
import type { PostMeta } from './types'

// This code is refactored into TypeScript based on
// https://github.com/remarkjs/react-markdown/blob/main/lib/index.js
// LICENSE file: https://github.com/remarkjs/react-markdown/blob/main/license

export async function transformCodeWithOptions(
  code: string,
  options: { remark: PluggableList; rehype: PluggableList } = {
    remark: [],
    rehype: [],
  },
) {
  const processor = unified()
    .use(remarkParse)
    .use(options.remark)

    .use(remarkRehype)
    .use(options.rehype)
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

type TransformOption = Pick<PostMeta, 'definitions' | 'emoji' | 'variable'>

async function transfromCode2Jsx(
  code: string,
  { definitions = {}, variable = {}, emoji = {} }: TransformOption,
) {
  const node = await transformCodeWithOptions(code, {
    remark: [
      remarkGfm,
      remarkDirective,
      remarkContainerDirectivePlugin,
      remarkSlugPlugin,
      remarkCodeBlcokPlugin,
      [remarkDefinition, Object.assign({}, definitionMap, definitions)],
      remarkRunner,
      [remarkPlainTextPlugin, code, { variable, emoji }],
      remarkHtmlParser,
    ],
    rehype: [rehypeElementPlugin, rehypeShikiHighlight],
  })
  return node
}

export default transfromCode2Jsx
