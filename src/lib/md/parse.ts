import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

interface Md2htmlOpts {
  lazy: boolean
}

export async function md2html(
  md: string,
  options: Md2htmlOpts = {
    lazy: true,
  },
) {
  const { lazy } = options
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
  if (lazy) {
    // eslint-disable-next-line @stylistic/quotes
    markdown = markdown.replace(/<img/g, "<img loading='lazy'")
  }
  return markdown
}

interface Md2tocOpts {
  isPython?: boolean
}

interface Toc {
  level: number
  title: string
}

export function md2toc(
  md: string,
  options: Md2tocOpts = {
    isPython: false,
  },
) {
  const { isPython } = options
  let pos = 0
  const toc: Toc[] = []
  let codePos = 0
  if (isPython) {
    while ((codePos = md.indexOf('```')) !== -1) {
      const end = md.indexOf('```', codePos + 3)
      md = md.replace(md.slice(codePos, end + 3), '')
    }
  }

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

export async function parseMd(
  md: string,
  options: Md2htmlOpts & Md2tocOpts = {
    lazy: true,
    isPython: false,
  },
) {
  const { lazy, isPython } = options
  const data = {
    html: await md2html(md, { lazy }),
    toc: md2toc(md, { isPython }),
  }

  return data
}
