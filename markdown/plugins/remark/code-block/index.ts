// !!! if you add some custom component here, remember modify plugins/mark-pre.ts
import path from 'node:path'
import { visit } from 'unist-util-visit'
import type { Code } from 'mdast'
import { isJsxFileLike } from '@/lib/shared'
import {
  handlePlaygroundHidePreviewTabsKey,
  PlaygroundName,
  handlePlaygroundStyles,
  PlaygroundHidePreviewTabsName,
  PlaygroundHideCodeTabsName,
  handlePlaygroundCustomPreivew,
} from './playground-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleComponentName,
  handleComponentDefaultSelectorKey,
  handleFileMap,
  handleLang,
  type RemarkPlugin,
} from '../../constant'
import { makeProperties } from '../../utils'
import { SwitcherName } from './switcher-utils'
import { entries, keys } from '@/lib/types'
import { handlePreTitleValue, PreTitleName } from './pre-title-utils'
import { sucraseParse } from '@/lib/node/jsx-parse'
import { tryReadFileSync } from '@/lib/node/fs'
import { MarkdownPath } from '~/data/constants/node'
import { markComponent } from '../utils'
import {
  buildFiles,
  getFirstFileKey,
  isDyncmicLangugage,
  isStaticLangugage,
} from './playground-node-utils'

const PreTitleRegx = /title=(['"])([^'"]+)\1/
interface RemoteNode {
  node: Code
  path: string
}

const remarkCodeBlcokPlugin: RemarkPlugin = () => {
  const remoteNodes: RemoteNode[] = []
  return async (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      // meta: path and component
      hanlePathComponentMeta(node, remoteNodes)
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
      const defaultSelector = getFirstFileKey(code, lang)

      const changeNodeType = () => {
        markComponent(node)
        handleComponentMeta(props, meta)
      }
      handleComponentCode(props, code)
      handleLang(props, lang)

      const setNodeProps = () => {
        const componentName = isPlayground
          ? PlaygroundName
          : isSwitcher
          ? SwitcherName
          : undefined
        if (!componentName) {
          return
        }
        handleComponentName(props, componentName)
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
        changeNodeType()
      }
      if (isPlayground) {
        if (isDyncmicLangugage(lang)) {
          setNodeProps()
        } else if (isStaticLangugage(lang)) {
          setNodeProps()
        }
      } else if (isSwitcher && defaultSelector) {
        setNodeProps()
      } else if (isPreTitle) {
        const title = PreTitleRegx.exec(meta)?.[2]
        if (title) {
          handleComponentName(props, PreTitleName)
          handlePreTitleValue(props, title)
          changeNodeType()
        }
      }
    })
    await Promise.all(
      remoteNodes.map(async ({ node, path }) => {
        try {
          const content = await fetch(path).then((res) => res.text())
          node.value = content.trim()
        } catch (error) {}
      }),
    )
  }
}

const CodePathRegx = /path=(['"])([^'"]+)\1/
const CodeComponentRegx = /component=(['"])([^'"]+)\1/

function hanlePathComponentMeta(node: Code, remoteNodes: RemoteNode[]) {
  const props = node.data!.hProperties!
  const meta = node.meta
  if (!meta) {
    return
  }
  const componentName = CodeComponentRegx.exec(meta)?.[2]
  const componentPath = CodePathRegx.exec(meta)?.[2]
  if (componentName) {
    handlePlaygroundCustomPreivew(props, componentName)
  }
  if (componentPath) {
    const isRemote = componentPath.startsWith('http')
    if (isRemote) {
      remoteNodes.push({ node, path: componentPath })
    } else {
      const componentName =
        componentPath.endsWith('.tsx') || componentPath.endsWith('.jsx')
          ? componentPath
          : `${componentPath}.tsx`
      const content = tryReadFileSync(
        path.join(MarkdownPath, 'components', componentName),
      )
      node.value = content.trim()
    }
  }
}

export default remarkCodeBlcokPlugin
