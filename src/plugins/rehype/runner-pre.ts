import { type Element } from 'hast'
import { isRuner } from '../remark/runner'
import {
  handleComponentCode,
  handleComponentMetaFromProps,
  handleLangFromProps,
} from '../constant'

function markRunnerPre(node: Element) {
  const props = node.properties
  if (isRuner(props)) {
    const meta = handleComponentMetaFromProps(props)
    const code = handleComponentCode(props)
    const lang = handleLangFromProps(props)
    node.tagName = 'pre'
    if (!node.data) {
      node.data = {}
    }
    node.data!.meta = meta
    node.children = [
      {
        type: 'element',
        tagName: 'code',
        properties: {
          className: `language-${lang}`,
        },
        children: [{ type: 'text', value: code }],
      },
    ]
  }
}

export default markRunnerPre
