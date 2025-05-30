import { type PluggableList, unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeShikiPlugin from './plugins/rehype/shiki/hightlight'
import rehypeElementPlugin from './plugins/rehype/elements'
import remarkSlugPlugin from './plugins/remark/slug'
import { remarkContainerDirectivePlugin } from './plugins/remark/directive/index'
import remarkRunnerPlugin from './plugins/remark/logger'
import { remarkPlainTextPlugin } from './plugins/remark/text/index'
import { markdownComponents } from './hast-components'
import remarkHtmlParser from './plugins/remark/html-parse'
import remarkDefinition from 'remark-definition'
import definitionMap from './config/definitions'
import type { PostMeta } from './types'
import { assign } from '@/lib/types'
import remarkCodeComponentsPlugin from './plugins/remark/code/components'
import remarkCodeMetaPlugin from './plugins/remark/code/meta'
import remarkCodeTitlePlugin from './plugins/remark/code/title'
import remarkFileTreePlugin from './plugins/remark/code/file-tree/file-tree'
import rehypeCodeCollapsePlugin from './plugins/rehype/code-collapse'
import rehypeCodeFormatPlugin from './plugins/rehype/shiki-children-format'
import remarkAbbrPlugin from './plugins/remark/abbr'

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

type TransformOption = Pick<
  PostMeta,
  'definitions' | 'emoji' | 'variable' | 'abbr'
>
// This code is refactored into TypeScript based on
// https://github.com/remarkjs/react-markdown/blob/main/lib/index.js
// LICENSE file: https://github.com/remarkjs/react-markdown/blob/main/license
async function transfromCode2Jsx(
  code: string,
  { definitions = {}, variable = {}, emoji = {}, abbr = {} }: TransformOption,
) {
  const node = await transformCodeWithOptions(code, {
    remark: [
      remarkGfm,
      remarkDirective,
      remarkContainerDirectivePlugin,
      remarkSlugPlugin,
      remarkCodeMetaPlugin,
      remarkFileTreePlugin,
      remarkCodeComponentsPlugin,
      [
        remarkDefinition,
        assign(definitionMap, definitions),
        {
          caseInsensitive: false,
        },
      ],
      remarkRunnerPlugin,
      [remarkPlainTextPlugin, { variable, emoji }],
      [remarkAbbrPlugin, abbr],
      remarkHtmlParser,
      remarkCodeTitlePlugin,
    ],
    rehype: [
      rehypeElementPlugin,
      rehypeShikiPlugin,
      rehypeCodeFormatPlugin,
      rehypeCodeCollapsePlugin,
    ],
  })
  return node
}

export default transfromCode2Jsx
