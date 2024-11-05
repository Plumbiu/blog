import { type Element } from 'hast'
import { SKIP, visit } from 'unist-util-visit'
import { isNumber, isString } from '@/utils'
import { RehypePlugin } from '../constant'

function rehypeImage(): RehypePlugin {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img') {
        return
      }
      if (!parent || parent.type !== 'element') {
        return
      }
      let parentClassName = parent.properties.className ?? ''
      if (Array.isArray(parent)) {
        parentClassName = parent.join(' ')
      }
      if (
        isNumber(index) &&
        isString(parentClassName) &&
        !parentClassName.includes('image-wrap')
      ) {
        const children = parent.children
        let imageCount = 0
        const left: Element[] = []
        const right: Element[] = []
        for (const elm of children) {
          if (elm.type === 'element' && elm.tagName === 'img') {
            if (imageCount % 2 === 0) {
              left.push(elm)
            } else {
              right.push(elm)
            }
            imageCount++
          }
        }

        if (imageCount > 0) {
          parent.children.splice(index, imageCount, ...[...left, ...right])
          parent.properties.className = 'image-wrap'
          parent.tagName = 'div'
          parent.children = [
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: 'image-wrap-left',
              },
              children: left,
            },
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: 'image-wrap-right',
              },
              children: right,
            },
          ]
          console.log(parent.children)
          return SKIP
        }
      }
    })
  }
}

export default rehypeImage
