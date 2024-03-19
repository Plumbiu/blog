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

const langMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
}

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
    .use(rehypeRewrite, {
      rewrite(node, _idx, parent) {
        if (node.type === 'element') {
          if (node.tagName === 'img') {
            node.properties.loading = 'lazy'
          } else if (node.tagName === 'pre') {
            const child = node.children[0]
            if (child.type === 'element' && child.tagName === 'code') {
              const prop = (child.properties.className as string[])?.[0].slice(
                9,
              )
              if (prop) {
                node.properties['data-lang'] =
                  langMap[prop.toLowerCase()] ?? prop
              }
            }
          } else if (node.tagName === 'p') {
            const children = node.children
            if (children && children.length > 1) {
              const isImgs = children.every((el) => {
                return (
                  (el.type === 'element' && el.tagName === 'img') ||
                  (el.type === 'text' &&
                    (el.value === '\r\n' || el.value === '\n'))
                )
              })
              if (isImgs) {
                node.properties.className = 'Img-Wrapper'
              }
            }
          } else if (
            node.tagName[0] === 'h' &&
            +node.tagName[1] > 0 &&
            +node.tagName[1] < 7
          ) {
            const id = node.properties.id as string
            tocs.push({
              level: +node.tagName[1],
              hash: '#' + id,
              content: (node.children[0] as any).value,
            })
          }
        }
      },
    })
    .use(rehypeHighlight)
    .process(`# 目录\n${md}`)

  return { html: String(file), tocs }
}
