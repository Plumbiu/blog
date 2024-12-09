/* eslint-disable @stylistic/max-len */
import {
  type LeafDirective,
  type ContainerDirective,
} from 'mdast-util-directive'
import { visit } from 'unist-util-visit'
import { addNodeClassName, makeProperties } from '../utils'
import { ComponentKey, RemarkPlugin } from '../constant'

export const remarkContainerDirectivePlugin: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      makeProperties(node)
      noteContainerDirective(node)
      detailContainerDirective(node)
    })
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
