// !!! if you add some custom component here, remember modify plugins/mark-pre.ts
import { visit } from 'unist-util-visit'
import {
  handleComponentCode,
  handleComponentCodeTitle,
  handleComponentMeta,
  handleComponentName,
  handleIconMap,
  handleLang,
  type RemarkPlugin,
} from '../../constant'
import { makeProperties } from '../../utils'
import { PreTitleName } from './title-utils'
import { markComponent } from '../utils'
import { getIconFromFileName } from '~/markdown/utils/vscode-icon'

const PreTitleRegx = /title=(['"])([^'"]+)\1/
const remarkCodeTitlePlugin: RemarkPlugin = () => {
  return async (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      // meta: path and component
      const props = node.data!.hProperties!
      const code = node.value.trim()
      const meta = node.meta
      const lang = node.lang?.toLowerCase()

      if (!(meta && lang)) {
        return
      }
      const isPreTitle = PreTitleRegx.test(meta)

      if (!isPreTitle) {
        return
      }

      const title = PreTitleRegx.exec(meta)?.[2]
      const componentName = handleComponentName(props)
      if (title) {
        handleComponentCodeTitle(props, title)
        const iconMap: Record<string, string> = {}
        const icon = getIconFromFileName(title)
        iconMap[title] = icon
        handleIconMap(props, JSON.stringify(iconMap))
      }
      handleComponentCode(props, code)
      handleLang(props, lang)

      if (!componentName) {
        handleComponentName(props, PreTitleName)
        markComponent(node)
        handleComponentMeta(props, meta)
      }
    })
  }
}

export default remarkCodeTitlePlugin
