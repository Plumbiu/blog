import { visit } from 'unist-util-visit'
import noteContainerDirective from './note'
import detailContainerDirective from './detail'
import { RemarkReturn } from '../constant'
import { makeProperties } from '../utils'

export function remarkContainerDirectivePlugin(): RemarkReturn {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      makeProperties(node)
      noteContainerDirective(node)
      detailContainerDirective(node)
    })
  }
}
