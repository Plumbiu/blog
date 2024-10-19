import { visit } from 'unist-util-visit'
import { ComponentKey, RemarkReturn } from '../constant'
import { makeProperties } from '../utils'
import { getFirstLine, upperFirstChar } from '@/utils'

export const PlaygroundPrefix = `${ComponentKey}-playground`
const CodeKey = `${PlaygroundPrefix}-code`
const DefaultSelectorKey = `${PlaygroundPrefix}-selector`
const ComponentIDKey = `${PlaygroundPrefix}-id`
const ComponentLangKey = `${PlaygroundPrefix}-lang`
const ComponentMetaKey = `${PlaygroundPrefix}-meta`
export function getCodeFromProps(props: any): string {
  return props[CodeKey]
}
export function getLangFromProps(props: any): string {
  return props[ComponentLangKey]
}
export function getDefaultSelectorFromProps(props: any): string {
  return props[DefaultSelectorKey]
}
export function getComponentIdFromProps(props: any): string {
  return props[ComponentIDKey]
}
export function getComponentMetaFromProps(props: any): string {
  return props[ComponentMetaKey]
}
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

function remarkPlayground(): RemarkReturn {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const code = node.value.trim()
      const meta = node.meta
      const lang = node.lang?.toLowerCase()
      let alias = lang ? langAlias[lang] || lang : 'Txt'
      if (!alias) {
        alias = 'Txt'
      }
      props[ComponentLangKey] = upperFirstChar(alias)
      if (!lang || !meta?.includes(PlaygroundName)) {
        return
      }
      const firstLine = getFirstLine(code)
      const endIndex = firstLine.length
      const myBeAppFile = firstLine.startsWith('///')
        ? firstLine.replace('///', '').trim()
        : undefined
      const setNode = (selector: string) => {
        props[ComponentKey] = PlaygroundName
        props[DefaultSelectorKey] = selector
        props[CodeKey] = myBeAppFile ? code.slice(endIndex) : code
        props[ComponentMetaKey] = meta
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
