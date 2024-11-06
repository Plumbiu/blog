import fs from 'node:fs'
import path from 'node:path'
import { visit } from 'unist-util-visit'
import { transform, Options } from 'sucrase'
import { buildFiles, getFirstLine, isJsxFileLike } from '@/utils'
import { StringValueObj } from '@/types/base'
import {
  PlaygroundCustomPreivew,
  PlaygroundDefaultSelectorKey,
  PlaygroundFileMapKey,
  PlaygroundHideConsoleKey,
  PlaygroundHidePreviewKey,
  PlaygroundHideTabsKey,
  PlaygroundShowDefaultConsoleKey,
} from './playground-client'
import { ComponentCodeKey, ComponentKey, RemarkReturn } from '../constant'
import { makeProperties } from '../utils'

const transfromOptions: Options = {
  transforms: ['jsx', 'flow', 'imports'],
}

const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'react', 'js', 'ts'])
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
        props[ComponentKey] = PlaygroundName
        props[PlaygroundDefaultSelectorKey] = selector
        props[ComponentCodeKey] = myBeAppFile ? code.slice(endIndex) : code
        props[PlaygroundHidePreviewKey] = meta.includes('no-view')
        props[PlaygroundHideTabsKey] = meta.includes('no-tabs')
        props[PlaygroundHideConsoleKey] = meta.includes('no-console')
        if (
          PlaygroundNameCustomPreviewRegx.test(meta) &&
          PlaygroundPathRegx.test(meta)
        ) {
          const [_, component] =
            PlaygroundNameCustomPreviewRegx.exec(meta) ?? []
          const [__, p] = PlaygroundPathRegx.exec(meta) ?? []
          if (component && p) {
            let content = ''
            try {
              content = fs.readFileSync(
                path.join(process.cwd(), 'src', 'components', p),
                'utf-8',
              )
            } catch (error) {}
            props[PlaygroundCustomPreivew] = component
            props[ComponentCodeKey] = content
            props[PlaygroundHideTabsKey] = true
          }
        }
        const files: StringValueObj = buildFiles(code, selector)
        for (const key in files) {
          if (isJsxFileLike(key)) {
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
