// !!! if you add some custom component here, remember modify plugins/mark-pre.ts
import { visit } from 'unist-util-visit'
import { transform, type Options } from 'sucrase'
import { isJsxFileLike } from '@/lib'
import minifyCodeSync from '~/optimize/minify-code'
import {
  handlePlaygroundHidePreviewTabsKey,
  PlaygroundName,
  handlePlaygroundStyles,
  PlaygroundHidePreviewTabsName,
  PlaygroundHideCodeTabsName,
  buildFiles,
} from './playground-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleComponentName,
  handleComponentSelectorKey,
  handleFileMap,
  handleLang,
  type RemarkPlugin,
} from '../../constant'
import { getFirstFileKey, makeProperties } from '../../utils'
import { SwitcherName } from './switcher-utils'
import { entries, keys } from '@/lib/types'
import { handlePreTitleValue, PreTitleName } from './pre-title-utils'

const transfromOptions: Options = {
  transforms: ['jsx', 'typescript', 'imports'],
  production: true,
}

const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'js', 'ts'])
const SupportStaticPlaygroundLang = new Set(['html', 'css', 'js', 'txt'])
const PreTitleRegx = /title=(['"])([^'"]+)\1/

const remarkCodeBlcok: RemarkPlugin = () => {
  return (tree) => {
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
      const isPreTitle = PreTitleRegx.test(meta)
      const myBeAppFile = getFirstFileKey(code)

      const changeNodeType = () => {
        // @ts-ignore
        node.type = 'root'
        node.data!.hName = 'div'
        handleComponentMeta(props, meta)
      }
      handleComponentCode(props, code)
      handleLang(props, lang)

      const setNodeProps = (selector: string) => {
        const componentName = isPlayground
          ? PlaygroundName
          : isSwitcher
          ? SwitcherName
          : undefined
        if (!componentName) {
          return
        }
        handleComponentName(props, componentName)
        handleComponentSelectorKey(props, selector)
        handlePlaygroundHidePreviewTabsKey(
          props,
          meta.includes(PlaygroundHidePreviewTabsName),
        )

        let hideTabs = true
        const files = buildFiles(code, selector)
        const fileKeys = keys(files)
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
        changeNodeType()
      }
      if (isPlayground) {
        if (SupportPlaygroundLang.has(lang)) {
          setNodeProps(myBeAppFile ?? `App.${lang}`)
        } else if (SupportStaticPlaygroundLang.has(lang)) {
          setNodeProps(myBeAppFile ?? 'index.html')
        }
      } else if (isSwitcher && myBeAppFile) {
        setNodeProps(myBeAppFile)
      } else if (isPreTitle) {
        const title = PreTitleRegx.exec(meta)?.[2]
        if (title) {
          handleComponentName(props, PreTitleName)
          handlePreTitleValue(props, title)
          changeNodeType()
        }
      }
    })
  }
}

export default remarkCodeBlcok
