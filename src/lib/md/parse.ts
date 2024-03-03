import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

export async function md2html(md: string) {
  const file = await unified()
    .use(remarkParse) // Convert into markdown AST
    .use(remarkRehype) // Transform to HTML AST
    .use(rehypeSanitize) // Sanitize HTML input
    .use(rehypeStringify) // Convert AST into serialized HTML
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(remarkGfm)
    .process(md)
  let markdown = String(file)
  // eslint-disable-next-line @stylistic/quotes
  markdown = markdown.replace(/<img/g, "<img loading='lazy'")
  return markdown
}

interface Toc {
  level: number
  title: string
}

export function md2toc(md: string) {
  let pos = 0
  const toc: Toc[] = []

  while (((pos = md.indexOf('#')), pos) !== -1) {
    if (md[pos - 1] !== '\n' && pos !== 0) {
      md = md.slice(++pos)
      continue
    }
    const start = pos
    while (md[pos] === '#') {
      pos++
    }
    const level = pos - start
    const title = md.slice(pos + 1, (pos = md.indexOf('\n', pos)))
    toc.push({
      level,
      title,
    })
    md = md.slice(pos)
  }
  return toc
}
