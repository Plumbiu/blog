import { visit } from 'unist-util-visit'
import type { PhotoNode } from './gallery-utils'
import { makeProperties } from '../../utils'
import type { RemarkPlugin } from '../../constant'
import iframeLeafDirective from './iframe'
import detailContainerDirective from './detail'
import galleryContainerDirective, { handleGalleryNodes } from './gallery'

export const remarkContainerDirectivePlugin: RemarkPlugin = () => {
  const photoNodes: PhotoNode[] = []
  return async (tree) => {
    visit(tree, 'containerDirective', (node) => {
      makeProperties(node)
      detailContainerDirective(node)
      galleryContainerDirective(node, photoNodes)
    })

    visit(tree, 'leafDirective', (node, _index, parent) => {
      if (!parent) {
        return
      }
      makeProperties(node)
      iframeLeafDirective(node)
    })

    await handleGalleryNodes(photoNodes)
  }
}
