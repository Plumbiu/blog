import matter from 'gray-matter'
import type { PostMeta } from '../types'
import stripMarkdown from '~/markdown/utils/strip'
import { isEmptyObject } from '@/lib/shared'

const DescNumRegx = /^\d+$/
export const FrontmatterWrapStr = '---'
export function parsePostMeta(markdown: string) {
  const { content, data } = matter(markdown)
  if (isEmptyObject(data)) {
    return
  }
  const meta = data as PostMeta
  const desc = meta.desc
  const rawText = stripMarkdown(content).trim()
  if (desc && DescNumRegx.test(desc)) {
    const segments = rawText.split(/\r?\n/g).filter((s) => s.trim())
    meta.desc = segments.length > 0 ? segments[+desc - 1] : ''
  }
  if (meta.date) {
    meta.date = new Date(meta.date).valueOf()
  }
  meta.wordLength = rawText.replace(/\s+/g, '').length
  return {
    meta,
    content,
  }
}
