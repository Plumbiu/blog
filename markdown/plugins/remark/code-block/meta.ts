// !!! if you add some custom component here, remember modify plugins/mark-pre.ts
import path from 'node:path'
import { visit } from 'unist-util-visit'
import type { Code } from 'mdast'
import type { RemarkPlugin } from '../../constant'
import { makeProperties } from '../../utils'
import { tryReadFileSync } from '@/lib/node/fs'
import { MarkdownPath } from '~/data/constants/node'
import { handlePlaygroundCustomPreivew } from './playground-utils'

interface RemoteNode {
  node: Code
  path: string
}

const CodePathRegx = /path=(['"])([^'"]+)\1/
const CodeComponentRegx = /component=(['"])([^'"]+)\1/
const remarkCodeMetaPlugin: RemarkPlugin = () => {
  const remoteNodes: RemoteNode[] = []
  return async (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      // meta: path and component
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

export default remarkCodeMetaPlugin
