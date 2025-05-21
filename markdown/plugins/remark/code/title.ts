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
import { TitleCodeName } from './title-utils'
import { markComponent } from '../utils'
import { getIconFromFileName } from '~/markdown/utils/vscode-icon'

const TitleRegx = /title=(['"])([^'"]+)\1/
const remarkCodeTitlePlugin: RemarkPlugin = () => {
  return async (tree) => {
    visit(tree, (node) => {
      if (node.type === 'code') {
        makeProperties(node)
        // meta: path and component
        const props = node.data!.hProperties!
        const code = node.value.trim()
        const meta = node.meta || handleComponentMeta(props)
        const lang = node.lang?.toLowerCase()

        if (!(meta && lang)) {
          return
        }
        const title = TitleRegx.exec(meta)?.[2]
        if (!title) {
          return
        }
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
          handleComponentName(props, TitleCodeName)
          markComponent(node)
          handleComponentMeta(props, meta)
        }
      } else if (node.type === 'root') {
        makeProperties(node)
        const props = node.data!.hProperties!
        const meta = handleComponentMeta(props)
        const title = TitleRegx.exec(meta)?.[2]
        if (!title) {
          return
        }
        handleComponentCodeTitle(props, title)
      }
    })
  }
}

export default remarkCodeTitlePlugin
