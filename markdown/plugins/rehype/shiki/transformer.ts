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
    line(node, line) {
      const str = toString(node)
      // meta hightlight word
      if (highlightWord) {
        const hightlightWordIndex = str.indexOf(highlightWord)
        if (highlightWord && hightlightWordIndex !== -1) {
          let count = 0
          for (const child of node.children) {
            if (child.type !== 'element') {
              continue
            }
            const childStr = toString(child)
            const endIndex = hightlightWordIndex + highlightWord.length
            if (count >= hightlightWordIndex && count < endIndex) {
              this.addClassToHast(child, HighLightWordClassName)
            }
            count += childStr.length
          }
        }
      }
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
        const ch = str.substring(0, 1)
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
        const firstNode = line.children.find(find)
        const lastNode = line.children.findLast(find)
        if (
          firstNode?.type === 'element' &&
          lastNode?.type === 'element' &&
          firstNode !== lastNode
        ) {
          this.addClassToHast(firstNode, `${HighLightWordClassName}-start`)
          this.addClassToHast(lastNode, `${HighLightWordClassName}-end`)
        }
      })
    },
  }
}
