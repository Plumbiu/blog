import type { ShikiTransformer } from 'shiki'
import { toString } from 'hast-util-to-string'
import {
  calculateLinesToHighlight,
  DiffDeletedClassName,
  DiffInsertedClassName,
  HighLightLineClassName,
} from './highlight-utils'

interface TransformerOptions {
  meta: string
  lang: string
}

const HightLightWordRegx = /\s\/([^/]+)\//
export function customShikiTranformer({
  meta,
  lang,
}: TransformerOptions): ShikiTransformer {
  const shouldHighlightLine = calculateLinesToHighlight(meta)
  const shouldAddNumber = meta.includes('line')
  // path="/posts/test.md" will match if the meta does not start with " "
  const highlightWord = HightLightWordRegx.exec(' ' + meta)?.[1]
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
      if (shouldHighlightLine(line)) {
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
