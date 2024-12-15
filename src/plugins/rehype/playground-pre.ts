import type { Element } from 'hast'
import {
  isPlayground,
  handlePlaygroundSelector,
  PlaygroundPrefix,
  buildFiles,
} from '../remark/playground-utils'
import { handleComponentCode } from '../constant'
import { buildHandlerFunction } from '../utils'

const PlaygroundFileKey = `${PlaygroundPrefix}file-key`
export const handlePlaygroundFileKey = buildHandlerFunction(PlaygroundFileKey)

function getSuffix(name: string) {
  const index = name.lastIndexOf('.')
  if (index === -1) {
    return ''
  }
  return name.slice(index + 1)
}

function markPlaygroundPre(node: Element) {
  const props = node.properties
  if (!isPlayground(props)) {
    return
  }
  const code = handleComponentCode(props)
  const selector = handlePlaygroundSelector(props)
  const files = buildFiles(code, selector)
  node.tagName = 'pre'
  if (!node.data) {
    node.data = {}
  }
  node.children = Object.keys(files).map((key) => {
    const item = files[key]
    const lang = getSuffix(key).toLowerCase()
    const props: Record<string, string> = {
      className: `language-${lang}`,
      [PlaygroundFileKey]: key,
    }
    return {
      type: 'element',
      tagName: 'code',
      properties: props,
      data: {
        meta: item.meta,
      },
      children: [{ type: 'text', value: item.code }],
    }
  })
}

export default markPlaygroundPre
