import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeRewrite from 'rehype-rewrite'
import remarkTextr from 'remark-textr'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import { NodeType, rewritePlugins } from './plugins'
import { rewriteCodeLang } from './plugins/code-lang'
import { rewriteLazyImage } from './plugins/lazy-image'
import { rewriteToc } from './plugins/toc'
import { rewriteImageWrapper } from './plugins/img-wrap'

export async function md2html(md: string) {
  const tocs: Toc[] = []
  const file = await unified()
    .use(remarkParse) // Convert into markdown AST
    .use(remarkGfm)
    .use(remarkToc, {
      maxDepth: 3,
      heading: '目录',
    })
    .use(remarkTextr)
    .use(remarkRehype) // Transform to HTML AST
    .use(rehypeSanitize) // Sanitize HTML input
    .use(rehypeSlug)
    .use(rehypeStringify) // Convert AST into serialized HTML
    .use(rehypePrism, {
      ignoreMissing: true,
      showLineNumbers: true,
    })
    .use(
      rehypeRewrite,
      rewritePlugins(
        rewriteCodeLang,
        rewriteLazyImage,
        rewriteImageWrapper,
        (node: NodeType) => {
          tocs.push(...rewriteToc(node))
        },
      ),
    )
    .process(`# 目录\n${md}`)

  return { html: String(file), tocs }
}
