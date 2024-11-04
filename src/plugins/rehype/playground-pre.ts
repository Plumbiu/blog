import { type Element } from 'hast'
import { buildFiles } from '@/utils'
import {
  isPlayground,
  getDefaultSelectorFromProps,
  PlaygroundPrefix,
} from '../remark/playground'
import { getCodeFromProps, getComponentMetaFromProps } from '../constant'
import { buildGetFunction } from '../utils'

const PlaygroundFileKey = `${PlaygroundPrefix}file-key`
export const getFileKeyFromProps = buildGetFunction(PlaygroundFileKey)

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
  const code = getCodeFromProps(props)
  const selector = getDefaultSelectorFromProps(props)
  const files = buildFiles(code, selector)
  const meta = getComponentMetaFromProps(props)

  node.tagName = 'pre'
  if (!node.data) {
    node.data = {}
  }
  node.data!.meta = meta
  node.children = Object.keys(files).map((key, i) => {
    const lang = getSuffix(key).toLocaleLowerCase()
    const props: Record<string, string> = {
      className: `language-${lang}`,
      [PlaygroundFileKey]: key,
    }
    return {
      type: 'element',
      tagName: 'code',
      properties: props,
      data: {
        meta: i === 0 ? meta : undefined,
      },
      children: [{ type: 'text', value: files[key] }],
    }
  })
}

export default markPlaygroundPre
