// !!! if you add some custom component here, remember modify plugins/mark-pre.ts
import { visit } from 'unist-util-visit'
import { isJsxFileLike } from '@/lib/shared'
import {
  handlePlaygroundHidePreviewTabsKey,
  PlaygroundName,
  handlePlaygroundStyles,
} from './playground-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleComponentDefaultSelectorKey,
  handleFileMap,
  handleLang,
  type RemarkPlugin,
  handleIconMap,
} from '../../constant'
import { makeProperties } from '../../utils'
import { SwitcherName } from './switcher-utils'
import { entries, keys } from '@/lib/types'
import { buildFiles, markComponent } from '../utils'
import { getDefaultSelector } from './playground-node-utils'
import { getIconFromFileName } from '~/markdown/utils/vscode-icon'
import { parseTsx } from '~/markdown/utils/tsx-parser'

const remarkCodeComponentsPlugin: RemarkPlugin = () => {
  return async (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const code = node.value.trim()
      const meta = node.meta
      const lang = node.lang?.toLowerCase()

      if (!(meta && lang)) {
        return
      }
      const isPlayground = meta.includes(PlaygroundName)
      const isSwitcher = meta.includes(SwitcherName)
      const defaultSelector = getDefaultSelector(code, lang)

      if (!isPlayground && !isSwitcher) {
        return
      }

      const componentName = isPlayground ? PlaygroundName : SwitcherName
      markComponent(node, componentName)
      // see rehype-mark-pre
      handleComponentCode(props, code)
      handleLang(props, lang)
      handleComponentMeta(props, meta)
      handleComponentDefaultSelectorKey(props, defaultSelector)

      const files = buildFiles(code, defaultSelector)
      const fileKeys = keys(files)
      let styles = ''
      const iconmap: Record<string, string> = {}
      for (const key of fileKeys) {
        const { code } = files[key]
        const icon = getIconFromFileName(key)
        iconmap[key] = icon
        if (isJsxFileLike(key)) {
          files[key].code = parseTsx(code)
        } else if (key.endsWith('.css')) {
          styles += ` ${code}`
        }
      }
      handleIconMap(props, JSON.stringify(iconmap))
      handlePlaygroundHidePreviewTabsKey(props, !code.includes('console.log('))
      handleFileMap(
        props,
        JSON.stringify(
          Object.fromEntries(entries(files).map(([k, v]) => [k, v.code])),
        ),
      )
      handlePlaygroundStyles(props, styles)
    })
  }
}

export default remarkCodeComponentsPlugin
