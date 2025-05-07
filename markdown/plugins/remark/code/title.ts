// !!! if you add some custom component here, remember modify plugins/mark-pre.ts
import { visit } from 'unist-util-visit'
import {
  handleComponentCode,
  handleComponentCodeTitle,
  handleComponentMeta,
  handleComponentName,
  handleLang,
  type RemarkPlugin,
} from '../../constant'
import { makeProperties } from '../../utils'
import { PreTitleName } from './title-utils'
import { markComponent } from '../utils'

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

      handleComponentCode(props, code)
      handleLang(props, lang)

      const title = PreTitleRegx.exec(meta)?.[2]
      const componentName = handleComponentName(props)
      if (title) {
        handleComponentCodeTitle(props, title)
      }
      if (!componentName) {
        handleComponentName(props, PreTitleName)
        markComponent(node)
        handleComponentMeta(props, meta)
      }
    })
  }
}

export default remarkCodeTitlePlugin
