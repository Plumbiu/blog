import fs from 'node:fs'
import path from 'node:path'
import { visit } from 'unist-util-visit'
import { transform, Options } from 'sucrase'
import { buildFiles, getFirstLine, isJsxFileLike } from '@/utils'
import { StringValueObj } from '@/types/base'
import {
  handlePlaygroundCustomPreivew,
  handlePlaygroundHideConsoleKey,
  handlePlaygroundHidePreviewKey,
  handlePlaygroundHideTabsKey,
  handlePlaygroundSelector,
  handlePlaygroundDefaultShowConsoleKey,
  handlePlaygroundFileMapKey,
} from './playground-utils'
import {
  ComponentKey,
  handleComponentCode,
  handleComponentName,
  RemarkReturn,
} from '../constant'
import { makeProperties } from '../utils'

const transfromOptions: Options = {
  transforms: ['jsx', 'flow', 'imports'],
}

const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'js', 'ts'])
const SupportStaticPlaygroundLang = new Set(['html', 'css', 'js', 'txt'])

export const PlaygroundName = 'Playground'
export function isPlayground(props: any) {
  return props[ComponentKey] === PlaygroundName
}

const SplitKey = '///'
const PlaygroundNameCustomPreviewRegx = /Playground=(\w+)/
const PlaygroundPathRegx = /path=['"]([^'"]+)['"]/
function remarkPlayground(): RemarkReturn {
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
        handlePlaygroundHidePreviewKey(props, meta.includes('no-view'))
        handlePlaygroundHideTabsKey(props, meta.includes('no-tab'))
        handlePlaygroundHideConsoleKey(props, meta.includes('no-console'))

        const previewName = PlaygroundNameCustomPreviewRegx.exec(meta)?.[1]
        const previewFilePath = PlaygroundPathRegx.exec(meta)?.[1]
        if (previewName && previewFilePath) {
          let content = ''
          try {
            content = fs.readFileSync(
              path.join(process.cwd(), 'src', 'components', previewFilePath),
              'utf-8',
            )
          } catch (error) {}
          handlePlaygroundCustomPreivew(props, previewName)
          handleComponentCode(props, content.trim())
          handlePlaygroundHideTabsKey(props, true)
        }
        const files: StringValueObj = buildFiles(code, selector)
        for (const key in files) {
          if (isJsxFileLike(key)) {
            files[key] = transform(files[key], transfromOptions).code
          }
        }
        handlePlaygroundFileMapKey(props, JSON.stringify(files))
        handlePlaygroundDefaultShowConsoleKey(props, true)
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
