import type { LeafDirective, ContainerDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'
import { getImageProps } from 'next/image'
import { isString } from '@/lib/types'
import getBlurDataUrl from '~/optimize/blurhash'
import { isUnOptimized, resolveAssetPath } from '@/lib/shared'
import { getAssetImagePath } from '@/lib/node/fs'
import {
  GalleryPhotoKey,
  GalleryName,
  type Photo,
  type PhotoNode,
} from './gallery-utils'
import { addNodeClassName, makeProperties } from '../utils'
import {
  ComponentKey,
  handleComponentName,
  type RemarkPlugin,
} from '../constant'
import { IframeName } from './iframe-utils'

const LineRegx = /\n/
const LineConfigRegx = /max-(\d+)/

export const remarkContainerDirectivePlugin: RemarkPlugin = () => {
  return async (tree) => {
    const photoNodes: PhotoNode[] = []
    visit(tree, 'containerDirective', (node) => {
      makeProperties(node)
      noteContainerDirective(node)
      detailContainerDirective(node)
      // Gallery
      if (node.name === GalleryName) {
        const data = node.data!
        const props = data.hProperties!
        const children = node.children
        if (children.length === 1) {
          const child = children[0]
          if (child && child.type === 'paragraph') {
            const contentNode = child.children[0]
            if (
              contentNode &&
              contentNode.type === 'text' &&
              isString(contentNode.value)
            ) {
              let links = contentNode.value.split(LineRegx)
              const maxNum = LineConfigRegx.exec(links[0])?.[1]
              if (maxNum) {
                links = links.slice(1)
              }
              props[ComponentKey] = node.name
              data.hName = 'div'
              photoNodes.push({ node, links, maxNum: Number(maxNum) })
            }
          }
        }
      }
    })
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
            const src = resolveAssetPath(`images/${link}`)
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

    visit(tree, 'leafDirective', (node, _index, parent) => {
      if (!parent) {
        return
      }
      parent.type = 'root'
      makeProperties(node)
      iframeLeafDirective(node)
    })
  }
}

function detailContainerDirective(node: ContainerDirective) {
  if (node.name === 'Details') {
    node.data!.hName = 'details'
    const summary = node.children[0]
    if (summary.type === 'paragraph') {
      const children = summary.children
      if (!children || !summary.data?.directiveLabel) {
        return
      }
      const firstChild = children[0]
      makeProperties(firstChild)
      firstChild.data!.hName = 'summary'
      node.children[0] = firstChild as any
    }
  }
}

function noteContainerDirective(node: ContainerDirective) {
  if (node.name === 'Note') {
    const data = node.data!
    const props = data.hProperties!
    data.hName = 'blockquote'
    const className = node.attributes?.class
    addNodeClassName(node, `blockquote-${className}`)
    const firstChild = node.children[0]
    if (firstChild.type === 'paragraph' && firstChild.data?.directiveLabel) {
      props['data-title'] = true
    }
  }
}

function iframeLeafDirective(node: LeafDirective) {
  const name = node.name
  if (name !== 'youtube' && name !== 'bilibili') {
    return
  }
  const data = node.data!
  const attributes = node.attributes!
  const id = attributes.id

  if (!id) {
    return
  }

  let src: string
  if (name === 'bilibili') {
    src = `https://player.bilibili.com/player.html?bvid=${id}&muted=false&autoplay=false`
  } else {
    src = `https://www.youtube.com/embed/${id}`
  }

  data.hName = 'div'

  data.hProperties = {
    src,
    width: '100%',
    height: 400,
    frameBorder: 0,
    allow: 'picture-in-picture',
    allowFullScreen: true,
  }
  handleComponentName(data.hProperties, IframeName)
}
