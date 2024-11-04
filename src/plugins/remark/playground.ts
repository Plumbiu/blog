import { visit } from 'unist-util-visit'
import { transform, Options } from 'sucrase'
import { buildFiles, getFirstLine, isJSXLike, upperFirstChar } from '@/utils'
import { StringValueObj } from '@/types/base'
import {
  ComponentCodeKey,
  ComponentKey,
  ComponentMetaKey,
  RemarkReturn,
} from '../constant'
import { buildGetFunction, makeProperties } from '../utils'

const transfromOptions: Options = {
  transforms: ['jsx', 'flow', 'imports'],
}

export const PlaygroundPrefix = `${ComponentKey}playground-`
export const PlaygroundDefaultSelectorKey = `${PlaygroundPrefix}selector`
export const PlaygroundLangKey = `${PlaygroundPrefix}lang`
export const PlaygroundShowDefaultConsoleKey = `${PlaygroundPrefix}console`
export const PlaygroundHidePreviewKey = `${PlaygroundPrefix}no-preview`
export const PlaygroundHideTabsKey = `${PlaygroundPrefix}no-tabs`
export const PlaygroundHideConsoleKey = `${PlaygroundPrefix}no-console`
export const PlaygroundFileMapKey = `${PlaygroundPrefix}file`

export const getLangFromProps = buildGetFunction<string>(PlaygroundLangKey)
export const getDefaultSelectorFromProps = buildGetFunction<string>(
  PlaygroundDefaultSelectorKey,
)
export const getComponentShowConsoleKey = buildGetFunction<boolean | undefined>(
  PlaygroundShowDefaultConsoleKey,
)
export const getComponentFileMapKey = buildGetFunction<StringValueObj>(
  PlaygroundFileMapKey,
  JSON.parse,
)
export const getPlaygroundHidePreviewKey = buildGetFunction<
  boolean | undefined
>(PlaygroundHidePreviewKey)
export const getPlaygroundHideTabsKey = buildGetFunction<boolean | undefined>(
  PlaygroundHideTabsKey,
)
export const getPlaygroundHideConsoleKey = buildGetFunction<
  boolean | undefined
>(PlaygroundHideConsoleKey)

const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'react', 'js', 'ts'])
const SupportStaticPlaygroundLang = new Set(['html', 'css', 'js', 'txt'])
export const PlaygroundName = 'Playground'
export function isPlayground(props: any) {
  return props[ComponentKey] === PlaygroundName
}
const langAlias: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
}

const SplitKey = '///'
const DefaultLang = 'Txt'
function remarkPlayground(): RemarkReturn {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const code = node.value.trim()
      const meta = node.meta
      const lang = node.lang?.toLowerCase()
      let alias = lang ? langAlias[lang] || lang : DefaultLang
      if (!alias) {
        alias = DefaultLang
      }
      props[PlaygroundLangKey] = upperFirstChar(alias)

      if (!lang || !meta?.includes(PlaygroundName)) {
        return
      }
      const firstLine = getFirstLine(code)
      const endIndex = firstLine.length
      const myBeAppFile = firstLine.startsWith(SplitKey)
        ? firstLine.replace(SplitKey, '').trim()
        : undefined
      const setNode = (selector: string) => {
        props[ComponentKey] = PlaygroundName
        props[PlaygroundDefaultSelectorKey] = selector
        props[ComponentCodeKey] = myBeAppFile ? code.slice(endIndex) : code
        props[ComponentMetaKey] = meta
        if (meta.includes('no-view')) {
          props[PlaygroundHidePreviewKey] = true
        }
        if (meta.includes('no-tabs')) {
          props[PlaygroundHideTabsKey] = true
        }
        if (meta.includes('no-console')) {
          props[PlaygroundHideConsoleKey] = true
        }
        const files: StringValueObj = buildFiles(code, selector)
        for (const key in files) {
          if (isJSXLike(key)) {
            files[key] = transform(files[key], transfromOptions).code
          }
        }
        props[PlaygroundFileMapKey] = JSON.stringify(files)
        if (meta.includes('console')) {
          props[PlaygroundShowDefaultConsoleKey] = true
        }
        // @ts-ignore
        node.type = 'root'
        node.data!.hName = 'div'
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
