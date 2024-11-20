import { type Element } from 'hast'
import { visit } from 'unist-util-visit'
import { isNumber } from '@/utils'
import markRunnerPre from './runner-pre'
import markPlaygroundPre from './playground-pre'
import { RehypePlugin } from '../constant'

function rehypeElementPlugin(): RehypePlugin {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      blankTargetPlugin(node)
      markPlaygroundPre(node)
      markRunnerPre(node)

      if (
        node.tagName === 'img' &&
        parent &&
        parent.type === 'element' &&
        isNumber(index)
      ) {
        const children = parent.children
        let imageCount = 0
        for (const elm of children) {
          const type = elm.type
          if (type === 'element' && elm.tagName === 'img') {
            imageCount++
          } else if (type === 'text') {
            if (elm.value.trim()) {
              return
            }
          } else {
            return
          }
        }

        if (imageCount > 0) {
          parent.properties.className = 'image-wrap'
          if (imageCount === 1) {
            parent.properties['data-one'] = true
          }
          if (imageCount % 2 === 1) {
            parent.properties['data-odd'] = true
          }
        }
      }
    })
  }
}

export default rehypeElementPlugin

function blankTargetPlugin(node: Element) {
  if (node.tagName === 'a') {
    node.properties.target = '_blank'
    node.properties.className = 'link'
  }
}
