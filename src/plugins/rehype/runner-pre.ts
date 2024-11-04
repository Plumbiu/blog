import { type Element } from 'hast'
import { isRuner } from '../remark/runner'
import {
  getCodeFromProps,
  getComponentMetaFromProps,
  getLangFromProps,
} from '../constant'

function markRunnerPre(node: Element) {
  const props = node.properties
  if (isRuner(props)) {
    const meta = getComponentMetaFromProps(props)
    const code = getCodeFromProps(props)
    const lang = getLangFromProps(props)
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
