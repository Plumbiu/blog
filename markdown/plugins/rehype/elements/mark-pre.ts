import type { Element } from 'hast'
import { isPlayground } from '../../remark/code/playground-utils'
import {
  FileMapItemKey,
  handleComponentCode,
  handleComponentMeta,
  handleComponentDefaultSelectorKey,
  handleLang,
} from '../../constant'
import { hCode, markPre } from './mark-pre-utils'
import { isSwitcher } from '../../remark/code/switcher-utils'
import { isRuner } from '../../remark/runner-utils'
import { isPreTitle } from '../../remark/code/title-utils'
import { keys } from '@/lib/types'
import { getSuffix } from '../../utils'
import { buildFiles } from '../../remark/code/playground-node-utils'
import {
  FileTreeMapItemKey,
  handleFileTreeMap,
  isFileTree,
} from '../../remark/code/fill-tree/file-tree-utils'

function markCustomComponentPre(node: Element) {
  const props = node.properties
  // remarkXXX make the type of node as 'root'
  // so data.meta and node.value is not available
  const code = handleComponentCode(props)
  const meta = handleComponentMeta(props)
  const lang = handleLang(props)
  if (isPlayground(props) || isSwitcher(props)) {
    const selector = handleComponentDefaultSelectorKey(props)
    // TODO: already build files in remark-plugin
    const files = buildFiles(code, selector)

    markPre(
      node,
      keys(files).map((key) => {
        const item = files[key]
        const childLang = getSuffix(key).toLowerCase()
        return hCode({
          meta: `${meta} ${item.meta}`,
          props: {
            className: `language-${childLang || lang}`,
            [FileMapItemKey]: key,
          },
          code: item.code,
        })
      }),
    )
  } else if (isPreTitle(props) || isRuner(props)) {
    markPre(node, [
      hCode({
        code,
        props: {
          className: `language-${lang}`,
        },
        meta,
      }),
    ])
  } else if (isFileTree(props)) {
    const treeMap = handleFileTreeMap(props)
    markPre(
      node,
      keys(treeMap).map((key) => {
        const code = treeMap[key]
        const childLang = getSuffix(key).toLowerCase()
        return hCode({
          code,
          props: {
            className: `language-${childLang}`,
            [FileTreeMapItemKey]: key,
          },
          meta,
        })
      }),
    )
  }
}

export default markCustomComponentPre
