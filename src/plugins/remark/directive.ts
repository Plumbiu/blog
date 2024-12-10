/* eslint-disable @stylistic/max-len */
import path from 'node:path'
import {
  type LeafDirective,
  type ContainerDirective,
} from 'mdast-util-directive'
import { visit } from 'unist-util-visit'
import { isString } from '@/utils/types'
import { getBlurDataUrl } from '@/utils/node/optimize'
import { resolveAssetPath } from '@/utils'
import { GalleryPhotoKey, GalleryName, Photo, PhotoNode } from './gallery-utils'
import { addNodeClassName, makeProperties } from '../utils'
import { ComponentKey, RemarkPlugin } from '../constant'

export const remarkContainerDirectivePlugin: RemarkPlugin = () => {
  return async (tree) => {
    const photoNodes: PhotoNode[] = []
    visit(tree, 'containerDirective', (node, index, parent) => {
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
              const links = contentNode.value.split(/\r?\n/)
              props[ComponentKey] = node.name
              data.hName = 'div'
              photoNodes.push({ node, links })
            }
          }
        }
      }
    })
    await Promise.all(
      photoNodes.map(async ({ node, links }) => {
        const images: Photo[] = []
        await Promise.all(
          links.map(async (link, i) => {
            const imagePath = path.join('public', 'images', link)
            const { base64, metadata } = await getBlurDataUrl(imagePath)
            if (!base64 || !metadata.width || !metadata.height) {
              return null
            }
            images.push({
              width: metadata.width,
              height: metadata.height,
              src: resolveAssetPath(`images/${link}`),
              alt: '',
              base64,
            })
          }),
        )
        node.data!.hProperties![GalleryPhotoKey] = JSON.stringify(images)
      }),
    )
    visit(tree, 'textDirective', (node, index, parent) => {
      if (!parent) {
        return
      }
      parent.type = 'root'
      makeProperties(node)
      node.data!.hName = 'div'
      node.data!.hProperties![ComponentKey] = node.name
    })
    visit(tree, 'leafDirective', (node, index, parent) => {
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

  let src
  if (name === 'bilibili') {
    src = `https://player.bilibili.com/player.html?bvid=${id}&muted=false&autoplay=false`
  } else {
    src = `https://www.youtube.com/embed/${id}`
  }

  data.hName = 'iframe'
  data.hProperties = {
    src,
    width: '100%',
    height: 400,
    frameBorder: 0,
    allow: 'picture-in-picture',
    allowFullScreen: true,
  }
}
