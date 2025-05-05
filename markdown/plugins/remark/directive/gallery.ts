import type { ContainerDirective } from 'mdast-util-directive'
import { toString } from 'mdast-util-to-string'
import {
  GalleryName,
  GalleryPhotoKey,
  type Photo,
  type PhotoNode,
} from './gallery-utils'
import { ComponentKey } from '../../constant'
import { getAssetImagePath } from '@/lib/node/fs'
import { resolveBasePath, isUnOptimized } from '@/lib/shared'
import { getImageProps } from 'next/image'
import getBlurDataUrl from '~/optimize/blurhash'

const LineRegx = /\n/
const LineConfigRegx = /max-(\d+)/
export default function galleryContainerDirective(
  node: ContainerDirective,
  photoNodes: PhotoNode[],
) {
  if (node.name === GalleryName) {
    const data = node.data!
    const props = data.hProperties!
    const value = toString(node)
    let links = value.split(LineRegx)
    const maxNum = LineConfigRegx.exec(links[0])?.[1]
    if (maxNum) {
      links = links.slice(1)
    }
    props[ComponentKey] = node.name
    data.hName = 'div'
    photoNodes.push({ node, links, maxNum: Number(maxNum) })
  }
}

export async function handleGalleryNodes(photoNodes: PhotoNode[]) {
  await Promise.all(
    photoNodes.map(async ({ node, links, maxNum }) => {
      const images: Photo[] = []
      await Promise.all(
        links.map(async (link) => {
          const imagePath = getAssetImagePath(link)
          const { base64, metadata } = await getBlurDataUrl(imagePath)
          const { width, height } = metadata ?? {}
          if (!base64 || !width || !height) {
            return
          }
          const src = resolveBasePath(`images/${link}`)
          const data: Photo = {
            width: width,
            height: height,
            src,
            alt: '',
            b64: base64,
            ops: src,
          }
          const unoptimized = isUnOptimized(src)

          if (!unoptimized) {
            const { props } = getImageProps({
              ...data,
              unoptimized,
              quality: 70,
            })
            data.ops = props.src
          }
          images.push(data)
        }),
      )
      node.data!.hProperties![GalleryPhotoKey] = JSON.stringify({
        photos: images,
        max: maxNum
          ? maxNum > images.length
            ? images.length
            : maxNum
          : undefined,
      })
    }),
  )
}
