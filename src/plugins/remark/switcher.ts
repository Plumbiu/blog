import { visit } from 'unist-util-visit'
import {
  FileMapStartStr,
  handleComponentCode,
  handleComponentName,
  handleComponentSelectorKey,
  handleFileMap,
  type RemarkPlugin,
} from '../constant'
import { getFirstFileKey, makeProperties } from '../utils'
import { SwitcherName } from './switcher-utils'
import { buildFiles } from './playground-utils'

const remarkSwitcher: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const meta = node.meta
      const code = node.value.trim()

      if (!meta?.includes(SwitcherName) || !code.startsWith(FileMapStartStr)) {
        return
      }
      const props = node.data!.hProperties!
      const appKey = getFirstFileKey(code)
      if (!appKey) {
        return
      }
      const files = buildFiles(code, appKey)

      handleComponentSelectorKey(props, appKey)
      handleComponentCode(props, code)
      handleComponentName(props, SwitcherName)
      handleFileMap(
        props,
        JSON.stringify(
          Object.fromEntries(
            Object.entries(files).map(([k, v]) => [k, v.code]),
          ),
        ),
      ) // @ts-ignore
      node.type = 'root'
      node.data!.hName = 'div'
    })
  }
}

export default remarkSwitcher
