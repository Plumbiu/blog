import { visit } from 'unist-util-visit'
import { type Image } from 'mdast'
import { getBlurDataUrl } from '@/utils/node/optimize'
import { resolveAssetPath } from '@/utils'
import { getAssetImagePath } from '@/utils/node/fs'
import {
  handleImageWidth,
  handleImageHeight,
  handleImagebase64,
} from './image-utils'
import { RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'

const remarkImage: RemarkPlugin = () => {
  return async (tree) => {
    const nodes: Image[] = []
    visit(tree, 'image', (node) => {
      makeProperties(node)
      nodes.push(node)
    })
    await Promise.all(
      nodes.map(async (node) => {
        const src = node.url
        const imagePath = getAssetImagePath(src)
        const { base64, metadata } = await getBlurDataUrl(imagePath)
        const data = node.data!
        const props = data!.hProperties!
        props.src = resolveAssetPath(`images/${src}`)
        handleImageWidth(props, metadata?.width)
        handleImageHeight(props, metadata?.height)
        handleImagebase64(props, base64)
      }),
    )
  }
}

export default remarkImage
