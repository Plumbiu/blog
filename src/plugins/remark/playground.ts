import path from 'node:path'
import { visit } from 'unist-util-visit'
import { transform, Options } from 'sucrase'
import { isJsxFileLike } from '@/utils'
import { tryReadFileSync } from '@/utils/node/fs'
import { minifyCodeSync } from '@/utils/node/optimize'
import { DataPath } from '@/utils/node/markdown'
import {
  handlePlaygroundCustomPreivew,
  handlePlaygroundHidePreviewTabsKey,
  handlePlaygroundSelector,
  handlePlaygroundFileMapKey,
  PlaygroundName,
  handlePlaygroundStyles,
  PlaygroundHidePreviewTabsKeySuffix,
  PlaygroundHideCodeTabsKeySuffix,
  buildFiles,
} from './playground-utils'
import {
  handleComponentCode,
  handleComponentMetaFromProps,
  handleComponentName,
  RemarkPlugin,
} from '../constant'
import { getBaseName, getFirstLine, makeProperties } from '../utils'

const transfromOptions: Options = {
  transforms: ['jsx', 'typescript', 'imports'],
  production: true,
}

const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'js', 'ts'])
const SupportStaticPlaygroundLang = new Set(['html', 'css', 'js', 'txt'])

const SplitKey = '///'
const PlaygroundNameCustomPreviewRegx = /Playground=['"]([^'"]+)['"]/
const PlaygroundCustomComponentRegx = /component=['"]([^'"]+)['"]/
const PlaygroundPathRegx = /path=['"]([^'"]+)['"]/
const remarkPlayground: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const code = node.value.trim()
      const meta = node.meta
      const lang = node.lang?.toLowerCase()
      if (!lang || !meta?.includes(PlaygroundName)) {
        return
      }

      const firstLine = getFirstLine(code)
      const endIndex = firstLine.length
      const myBeAppFile = firstLine.startsWith(SplitKey)
        ? firstLine.replace(SplitKey, '').trim()
        : undefined
      const setNode = (selector: string) => {
        handleComponentName(props, PlaygroundName)
        handlePlaygroundSelector(props, selector)
        handleComponentCode(props, myBeAppFile ? code.slice(endIndex) : code)
        handlePlaygroundHidePreviewTabsKey(
          props,
          meta.includes(PlaygroundHidePreviewTabsKeySuffix),
        )

        const previewName = PlaygroundNameCustomPreviewRegx.exec(meta)?.[1]
        const componentName = PlaygroundCustomComponentRegx.exec(meta)?.[1]
        const componentPath = PlaygroundPathRegx.exec(meta)?.[1]
        if (previewName) {
          const content = tryReadFileSync(
            path.join(DataPath, 'components', `${previewName}.tsx`),
          )
          handlePlaygroundCustomPreivew(props, getBaseName(previewName))
          handleComponentCode(props, content.trim())
        }
        if (componentName && componentPath) {
          const content = tryReadFileSync(
            path.join(DataPath, 'components', `${componentPath}.tsx`),
          )
          handlePlaygroundCustomPreivew(props, componentName)
          handleComponentCode(props, content.trim())
        }
        let hideTabs = true
        const files = buildFiles(code, selector)
        const fileKeys = Object.keys(files)
        let styles: string = ''
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
            styles += ' ' + code
          }
        }
        handlePlaygroundHidePreviewTabsKey(
          props,
          meta.includes(PlaygroundHideCodeTabsKeySuffix),
        )
        handlePlaygroundHidePreviewTabsKey(props, hideTabs)
        handlePlaygroundFileMapKey(
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
        handleComponentMetaFromProps(props, meta)
      }

      if (SupportPlaygroundLang.has(lang)) {
        setNode(myBeAppFile ?? `App.${lang}`)
      } else if (SupportStaticPlaygroundLang.has(lang)) {
        setNode(myBeAppFile ?? 'index.html')
      }
    })
  }
}

export default remarkPlayground
