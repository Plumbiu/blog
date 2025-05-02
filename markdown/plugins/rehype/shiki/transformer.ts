import type { ElementContent, Element } from 'hast'
import type { ShikiTransformer } from 'shiki'
import { toString } from 'hast-util-to-string'
import { isArray, isString } from '@/lib/types'
import {
  calculateLinesToHighlight,
  DiffDeletedClassName,
  DiffInsertedClassName,
  HighLightLineClassName,
  HighLightWordClassName,
  HighLightWordEndClassName,
  HighLightWordStartClassName,
} from './highlight-utils'

interface TransformerOptions {
  meta: string
  lang: string
}

const HightLightWordRegx = /\/(.+)\//
export function customShikiTranformer({
  meta,
  lang,
}: TransformerOptions): ShikiTransformer {
  const shouldHighlightLine = calculateLinesToHighlight(meta)
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
      if (shouldHighlightLine(line - 1)) {
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

export function shikiHightlightWordFormatTransformer(): ShikiTransformer {
  function find(node: ElementContent) {
    if (node.type !== 'element') {
      return false
    }
    const className = node.properties.class
    if (!isString(className) && !isArray(className)) {
      return false
    }
    return className.includes(HighLightWordClassName)
  }
  return {
    code(node) {
      const lines = node.children.filter(
        (i) => i.type === 'element',
      ) as Element[]
      lines.forEach((line) => {
        const firstNodeIndex = line.children.findIndex(find)
        const lastNodeIndex = line.children.findLastIndex(find)
        const firstNode = line.children[firstNodeIndex]
        const lastNode = line.children[lastNodeIndex]
        if (
          firstNode?.type === 'element' &&
          lastNode?.type === 'element' &&
          firstNodeIndex !== lastNodeIndex &&
          line.children.slice(firstNodeIndex, lastNodeIndex).every(find)
        ) {
          this.addClassToHast(firstNode, HighLightWordStartClassName)
          this.addClassToHast(lastNode, HighLightWordEndClassName)
        }
      })
    },
  }
}
