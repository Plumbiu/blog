import type { Element } from 'hast'
import {
  isPlayground,
  filemapToElementContent,
  buildFiles,
} from '../remark/code-block/playground-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleComponentSelectorKey,
  handleLang,
} from '../constant'
import { markPre } from './pre-utils'
import { isSwitcher } from '../remark/code-block/switcher-utils'
import { isRuner } from '../remark/runner-utils'

function markCustomComponentPre(node: Element) {
  const props = node.properties
  if (isPlayground(props) || isSwitcher(props)) {
    const code = handleComponentCode(props)
    const selector = handleComponentSelectorKey(props)
    // TODO: already build files in remark-plugin
    const files = buildFiles(code, selector)
    const meta = handleComponentMeta(props)
    markPre(node, filemapToElementContent(files, meta))
    return
  }
  if (isRuner(props)) {
    // remarkRunner make the type of node as 'root'
    // so data.meta is not available
    const meta = handleComponentMeta(props)
    const code = handleComponentCode(props)
    const lang = handleLang(props)
    markPre(node, [
      {
        type: 'element',
        tagName: 'code',
        properties: {
          className: `language-${lang}`,
        },
        data: {
          meta,
        },
        children: [{ type: 'text', value: code }],
      },
    ])
  }
}

export default markCustomComponentPre
