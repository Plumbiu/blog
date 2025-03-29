import type { Element } from 'hast'
import { isPlayground, buildFiles } from '../remark/code-block/playground-utils'
import {
  ComponentFileMapKey,
  handleComponentCode,
  handleComponentMeta,
  handleComponentSelectorKey,
  handleFileMap,
  handleLang,
} from '../constant'
import { hCode, markPre } from './mark-pre-utils'
import { isSwitcher } from '../remark/code-block/switcher-utils'
import { isRuner } from '../remark/runner-utils'
import { isPreTitle } from '../remark/code-block/pre-title-utils'
import { keys } from '@/utils/types'
import { getSuffix } from '../utils'

function markCustomComponentPre(node: Element) {
  const props = node.properties
  if (isPlayground(props) || isSwitcher(props)) {
    const code = handleComponentCode(props)
    const selector = handleComponentSelectorKey(props)
    // TODO: already build files in remark-plugin
    const files = buildFiles(code, selector)
    console.log(files, handleFileMap(props))
    const meta = handleComponentMeta(props)
    const lang = handleLang(props)
    markPre(
      node,
      keys(files).map((key) => {
        const item = files[key]
        const childLang = getSuffix(key).toLowerCase()
        return hCode({
          meta: `${meta} ${item.meta}`,
          props: {
            className: `language-${childLang || lang}`,
            [ComponentFileMapKey]: key,
          },
          code: item.code,
        })
      }),
    )
  } else if (isPreTitle(props) || isRuner(props)) {
    // remarkRunner make the type of node as 'root'
    // so data.meta is not available
    const meta = handleComponentMeta(props)
    const code = handleComponentCode(props)
    const lang = handleLang(props)
    markPre(node, [
      hCode({
        code,
        props: {
          className: `language-${lang}`,
        },
        meta,
      }),
    ])
  }
}

export default markCustomComponentPre
