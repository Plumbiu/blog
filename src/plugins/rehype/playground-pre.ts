import type { Element } from 'hast'
import {
  isPlayground,
  filemapToElementContent,
  buildFiles,
} from '../remark/playground-utils'
import { handleComponentCode, handleComponentSelectorKey } from '../constant'
import { markPre } from './pre-utils'

function markPlaygroundPre(node: Element) {
  const props = node.properties
  if (!isPlayground(props)) {
    return
  }
  const code = handleComponentCode(props)
  const selector = handleComponentSelectorKey(props)
  // TODO: already build files in remark-plugin
  const files = buildFiles(code, selector)
  markPre(node, filemapToElementContent(files))
}

export default markPlaygroundPre
