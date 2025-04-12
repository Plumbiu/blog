import yaml from 'js-yaml'
import type { PostMeta } from '../types'
import stripMarkdown from '~/markdown/utils/strip'

const DescNumRegx = /^\d+$/
export const FrontmatterWrapStr = '---'
export function parsePostMeta(code: string) {
  const startIdx = code.indexOf(FrontmatterWrapStr)
  if (startIdx !== 0) {
    return {}
  }
  const endIndex = code.indexOf(FrontmatterWrapStr, 1)
  const parseString = code.slice(FrontmatterWrapStr.length, endIndex)
  const meta = yaml.load(parseString) as PostMeta
  const desc = meta.desc
  const content = code.slice(endIndex + 3)
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
