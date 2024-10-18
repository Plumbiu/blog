import { visit } from 'unist-util-visit'
import { RemarkReturn } from '../constant'
import { makeProperties } from '../utils'
import noteContainerDirective from './note'
import detailContainerDirective from './detail'

export function remarkContainerDirectivePlugin(): RemarkReturn {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      makeProperties(node)
      noteContainerDirective(node)
      detailContainerDirective(node)
    })
  }
}
