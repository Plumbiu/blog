import type { Element } from 'hast'
import { handleComponentCode, handleComponentSelectorKey } from '../constant'
import { markPre } from './pre-utils'
import { isSwitcher } from '../remark/switcher-utils'
import { buildFiles, filemapToElementContent } from '../remark/playground-utils'

function markSwitcherPre(node: Element) {
  const props = node.properties
  if (isSwitcher(props)) {
    // remarkRunner make the type of node as 'root'
    // so data.meta is not available
    const code = handleComponentCode(props)
    const selector = handleComponentSelectorKey(props)
    const files = buildFiles(code, selector)
    // TODO: already build files in remark-plugin
    markPre(node, filemapToElementContent(files))
  }
}

export default markSwitcherPre
