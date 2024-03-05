import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeRewrite from 'rehype-rewrite'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

const langMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
}

export async function md2html(md: string) {
  const file = await unified()
    .use(remarkParse) // Convert into markdown AST
    .use(remarkRehype) // Transform to HTML AST
    .use(rehypeSanitize) // Sanitize HTML input
    .use(rehypeRewrite, {
      rewrite(node, _idx, parent) {
        if (node.type === 'element') {
          if (node.tagName === 'img') {
            node.properties.loading = 'lazy'
          } else if (node.tagName === 'pre') {
            const child = node.children[0]
            if (child.type === 'element') {
              const prop = (child.properties.className as string[])?.[0].slice(
                9,
              )
              if (prop) {
                node.properties['data-lang'] =
                  langMap[prop.toLowerCase()] ?? prop
              }
            }
          }
        }
      },
    })
    .use(rehypeStringify) // Convert AST into serialized HTML
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(remarkGfm)
    .process(md)
  return String(file)
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

interface Html2TocOpts {
  depth: number
}

interface MdTOC {
  level: number
  content: string
  hash: string
}

export function html2toc(
  html: string,
  options: Html2TocOpts = {
    depth: 3,
  },
) {
  const { depth } = options
  let levelDep = ''
  for (let i = 1; i <= depth; i++) {
    levelDep += i
  }
  const HLABEL = new RegExp(`<h[${levelDep}]`, 'g')
  const toc: MdTOC[] = []
  let m: RegExpExecArray | null
  while ((m = HLABEL.exec(html))) {
    const idx = m.index
    const idLoc = html.indexOf('id', idx) + 4
    const id = html.slice(idLoc, html.indexOf('"', idLoc))
    const content = html.slice(
      html.indexOf('>', idLoc) + 1,
      html.indexOf('</', idLoc),
    )
    toc.push({
      level: +m[0][2],
      hash: '#' + id,
      content,
    })
  }
  return toc
}
