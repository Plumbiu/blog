import type { LeafDirective } from 'mdast-util-directive'
import { IframeName } from './iframe-utils'
import { markComponent } from '../utils'

export default function iframeLeafDirective(node: LeafDirective) {
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

  let src: string | undefined
  if (name === 'bilibili') {
    src = `https://player.bilibili.com/player.html?bvid=${id}&muted=false&autoplay=false`
  } else if (name === 'youtube') {
    src = `https://www.youtube.com/embed/${id}`
  }

  if (!src) {
    return
  }

  data.hProperties = {
    src,
    width: '100%',
    height: 400,
    frameBorder: 0,
    allow: 'picture-in-picture',
    allowFullScreen: true,
  }
  markComponent(node, IframeName)
}
