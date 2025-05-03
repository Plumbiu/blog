// !!! if you add some custom component here, remember modify plugins/mark-pre.ts
import { visit } from 'unist-util-visit'
import { isJsxFileLike } from '@/lib/shared'
import {
  handlePlaygroundHidePreviewTabsKey,
  PlaygroundName,
  handlePlaygroundStyles,
  PlaygroundHidePreviewTabsName,
  PlaygroundHideCodeTabsName,
} from './playground-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleComponentDefaultSelectorKey,
  handleFileMap,
  handleLang,
  type RemarkPlugin,
} from '../../constant'
import { makeProperties } from '../../utils'
import { SwitcherName } from './switcher-utils'
import { entries, keys } from '@/lib/types'
import { sucraseParse } from '@/lib/node/jsx-parse'
import { markComponent } from '../utils'
import { buildFiles, getDefaultSelector } from './playground-node-utils'

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

      const componentName = isPlayground
        ? PlaygroundName
        : isSwitcher
        ? SwitcherName
        : undefined
      if (!componentName) {
        return
      }

      handleComponentCode(props, code)
      handleLang(props, lang)
      handleComponentMeta(props, meta)
      markComponent(node, componentName)
      handleComponentDefaultSelectorKey(props, defaultSelector)
      handlePlaygroundHidePreviewTabsKey(
        props,
        meta.includes(PlaygroundHidePreviewTabsName),
      )

      let hideTabs = true
      const files = buildFiles(code, defaultSelector)
      const fileKeys = keys(files)
      let styles = ''
      for (const key of fileKeys) {
        const { code } = files[key]
        if (isJsxFileLike(key)) {
          files[key].code = sucraseParse(code)
          if (code.includes('console.log(')) {
            hideTabs = false
          }
        } else if (key.endsWith('.css')) {
          styles += ` ${code}`
        }
      }
      handlePlaygroundHidePreviewTabsKey(
        props,
        meta.includes(PlaygroundHideCodeTabsName),
      )
      handlePlaygroundHidePreviewTabsKey(props, hideTabs)
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
