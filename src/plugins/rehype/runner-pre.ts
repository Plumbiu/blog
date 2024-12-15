import type { Element } from 'hast'
import { isRuner } from '../remark/runner-utils'
import {
  handleComponentCode,
  handleComponentMetaFromProps,
  handleLangFromProps,
} from '../constant'

function markRunnerPre(node: Element) {
  const props = node.properties
  if (isRuner(props)) {
    // remarkRunner make the type of node as 'root'
    // so data.meta is not available
    const meta = handleComponentMetaFromProps(props)
    const code = handleComponentCode(props)
    const lang = handleLangFromProps(props)
    node.tagName = 'pre'
    if (!node.data) {
      node.data = {}
    }
    node.children = [
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
    ]
  }
}

export default markRunnerPre
