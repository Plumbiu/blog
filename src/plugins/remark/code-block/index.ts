import { visit } from 'unist-util-visit'
import { transform, type Options } from 'sucrase'
import { isJsxFileLike } from '@/utils'
import { minifyCodeSync } from '@/utils/node/optimize'
import {
  handlePlaygroundHidePreviewTabsKey,
  PlaygroundName,
  handlePlaygroundStyles,
  PlaygroundHidePreviewTabsKeySuffix,
  PlaygroundHideCodeTabsKeySuffix,
  buildFiles,
} from './playground-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleComponentName,
  handleComponentSelectorKey,
  handleFileMap,
  type RemarkPlugin,
} from '../../constant'
import { getFirstFileKey, makeProperties } from '../../utils'
import { SwitcherName } from './switcher-utils'

const transfromOptions: Options = {
  transforms: ['jsx', 'typescript', 'imports'],
  production: true,
}

const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'js', 'ts'])
const SupportStaticPlaygroundLang = new Set(['html', 'css', 'js', 'txt'])

const remarkCodeBlcok: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const code = node.value.trim()
      const meta = node.meta
      const lang = node.lang?.toLowerCase()
      const isPlayground = meta?.includes(PlaygroundName)
      const isSwitcher = meta?.includes(SwitcherName)
      if (!(meta && lang)) {
        return
      }

      const myBeAppFile = getFirstFileKey(code)
      const setNode = (selector: string) => {
        handleComponentName(props, isPlayground ? PlaygroundName : SwitcherName)
        handleComponentSelectorKey(props, selector)
        handleComponentCode(props, code)
        handlePlaygroundHidePreviewTabsKey(
          props,
          meta.includes(PlaygroundHidePreviewTabsKeySuffix),
        )

        let hideTabs = true
        const files = buildFiles(code, selector)
        const fileKeys = Object.keys(files)
        let styles = ''
        for (const key of fileKeys) {
          const { code } = files[key]
          if (isJsxFileLike(key)) {
            files[key].code = minifyCodeSync(
              transform(code, transfromOptions).code,
            )
            if (code.includes('console.log(')) {
              hideTabs = false
            }
          } else if (key.endsWith('.css')) {
            styles += ` ${code}`
          }
        }
        handlePlaygroundHidePreviewTabsKey(
          props,
          meta.includes(PlaygroundHideCodeTabsKeySuffix),
        )
        handlePlaygroundHidePreviewTabsKey(props, hideTabs)
        handleFileMap(
          props,
          JSON.stringify(
            Object.fromEntries(
              Object.entries(files).map(([k, v]) => [k, v.code]),
            ),
          ),
        )
        handlePlaygroundStyles(props, styles)

        // @ts-ignore
        node.type = 'root'
        node.data!.hName = 'div'
        handleComponentMeta(props, meta)
      }
      if (isPlayground) {
        if (SupportPlaygroundLang.has(lang)) {
          setNode(myBeAppFile ?? `App.${lang}`)
        } else if (SupportStaticPlaygroundLang.has(lang)) {
          setNode(myBeAppFile ?? 'index.html')
        }
      } else if (isSwitcher && myBeAppFile) {
        setNode(myBeAppFile)
      }
    })
  }
}

export default remarkCodeBlcok
