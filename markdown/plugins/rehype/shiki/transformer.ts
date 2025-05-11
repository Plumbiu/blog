import type { ShikiTransformer } from 'shiki'
import { toString } from 'hast-util-to-string'
import {
  DiffDeletedClassName,
  DiffInsertedClassName,
  HighLightLineClassName,
} from './highlight-utils'
import { parsePart } from '~/markdown/utils/parse-part'

interface TransformerOptions {
  meta: string
  lang: string
}

const HightLightWordRegx = /\s\/([^/]+)\//
const HiglightRegxRegx = /\s{([\d,-.]+)}/
export function customShikiTranformer({
  meta,
  lang,
}: TransformerOptions): ShikiTransformer {
  // add white space to avoid meta like path="/posts/foo.md" be matched
  meta = ' ' + meta
  const hightlightLineMeta = HiglightRegxRegx.exec(meta)?.[1]
  const rangeSet = parsePart(hightlightLineMeta)
  const shouldAddNumber = meta.includes('line')
  const highlightWord = HightLightWordRegx.exec(meta)?.[1]
  return {
    preprocess(code) {
      if (highlightWord) {
        return `// [!code word:${highlightWord}]\n${code}`
      }
    },
    line(node, line) {
      // meta line
      if (shouldAddNumber) {
        node.properties['data-line'] = line
      }
      // meta hightlight line
      if (rangeSet.has(line)) {
        this.addClassToHast(node, HighLightLineClassName)
      }
      // meta diff
      if (lang.startsWith('diff-')) {
        const str = toString(node)
        const ch = str.slice(0, 1)
        if (ch !== '-' && ch !== '+') {
          return
        }
        node.children.splice(0, 1)
        this.addClassToHast(
          node,
          ch === '-' ? DiffDeletedClassName : DiffInsertedClassName,
        )
      }
    },
  }
}
