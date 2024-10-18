/* eslint-disable @stylistic/indent */
import type { Element } from 'hast'
import {
  isPlayground,
  getCodeFromProps,
  getDefaultSelectorFromProps,
  getComponentMetaFromProps,
  PlaygroundName,
  PlaygroundPrefix,
} from '../remark/playground'
import { buildFiles, getSuffix } from '@/utils'

const PlaygroundFileKey = `${PlaygroundPrefix}-file-key`
export function getFileKeyFromProps(props: any) {
  return props[PlaygroundFileKey]
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
  const parsedMeta = meta.replace(PlaygroundName, '')
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
        meta:
          i === 0
            ? parsedMeta
            : meta.includes('showLineNumbers')
            ? 'showLineNumbers'
            : undefined,
      },
      children: [{ type: 'text', value: files[key] }],
    }
  })
}

export default markPlaygroundPre
