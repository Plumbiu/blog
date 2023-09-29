import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

export async function renderMD(md: string) {
  const file = await unified()
    .use(remarkParse) // Convert into markdown AST
    .use(remarkRehype) // Transform to HTML AST
    .use(rehypeSanitize) // Sanitize HTML input
    .use(rehypeStringify) // Convert AST into serialized HTML
    .use(rehypeHighlight)
    .use(remarkSqueezeParagraphs)
    .use(rehypeSlug)
    .process(md)

  return String(file) // <p>Hello, Next.js!</p>
}

export function sanitizeID(id: string) {
  return id
    .replace(/\s/g, '-')
    .replace(/[<>(),]/g, '')
    .toLocaleLowerCase()
}
