import { type Element } from 'hast'
import {
  isPlayground,
  handlePlaygroundSelector,
  PlaygroundPrefix,
  buildFiles,
} from '../remark/playground-utils'
import { handleComponentCode, handleComponentMetaFromProps } from '../constant'
import { buildPlaygroundHandlerFunction } from '../utils'

const PlaygroundFileKey = `${PlaygroundPrefix}file-key`
export const handlePlaygroundFileKey =
  buildPlaygroundHandlerFunction(PlaygroundFileKey)

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
  const meta = handleComponentMetaFromProps(props)

  node.tagName = 'pre'
  if (!node.data) {
    node.data = {}
  }
  node.data!.meta = meta
  node.children = Object.keys(files).map((key) => {
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
        meta,
      },
      children: [{ type: 'text', value: files[key] }],
    }
  })
}

export default markPlaygroundPre
