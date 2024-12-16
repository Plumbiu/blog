import type { Element } from 'hast'
import { isRuner } from '../remark/runner-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleLang,
} from '../constant'
import { markPre } from './pre-utils'

function markRunnerPre(node: Element) {
  const props = node.properties
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

export default markRunnerPre
