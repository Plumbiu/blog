import { visit } from 'unist-util-visit'
import type { RehypePlugin } from '../constant'
import { isString } from '@/lib/types'
import { parsePart } from '~/markdown/utils/parse-part'
import type { ElementContent } from 'hast'
import { h } from 'hastscript'

const CollapseRegx = /collapse=(['"])([^'"]+)\1/
const rehypeCodeCollapsePlugin: RehypePlugin = () => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName !== 'code' ||
        index == null ||
        !parent ||
        parent.type !== 'element' ||
        parent.tagName !== 'pre'
      ) {
        return
      }
      const meta = node.data?.meta
      if (!isString(meta)) {
        return
      }
      const collapsed = CollapseRegx.exec(meta)?.[2]
      if (!isString(collapsed)) {
        return
      }
      const rangeSet = parsePart(collapsed)
      // 1,2,3  5,6  8 10
      const nodes: ElementContent[] = []
      for (let i = 0; i < node.children.length; i++) {
        const span = node.children[i]
        if (span.type === 'element' && span.tagName === 'span') {
          if (rangeSet.has(i + 1)) {
            let j = i + 1
            while (rangeSet.has(j + 1)) {
              j++
            }
            nodes.push(
              h('details', [
                h('summary', [
                  h(
                    'div',
                    {
                      className: 'code-extend-line',
                    },
                    h(
                      'span',
                      {
                        className: 'code-extend-text',
                      },
                      `${j - i} collapsed line`,
                    ),
                  ),
                ]),
                ...node.children.slice(i, j),
              ]),
            )
            i = j - 1
          } else {
            nodes.push(span)
          }
        }
      }
      node.children = nodes
    })
  }
}
export default rehypeCodeCollapsePlugin
