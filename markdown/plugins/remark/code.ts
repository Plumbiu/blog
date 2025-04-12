import path from 'node:path'
import type { Code } from 'mdast'
import { visit } from 'unist-util-visit'
import { tryReadFileSync } from '@/lib/node/fs'
import { handlePlaygroundCustomPreivew } from './code-block/playground-utils'
import { makeProperties } from '../utils'
import type { RemarkPlugin } from '../constant'
import { MarkdownPath } from '~/constants/node'

const CodePathRegx = /path=(['"])([^'"]+)\1/
const CodeComponentRegx = /component=(['"])([^'"]+)\1/

interface RemoteNode {
  node: Code
  path: string
}

const remarkCodeConfig: RemarkPlugin = () => {
  return async (tree) => {
    const remoteNodes: RemoteNode[] = []
    visit(tree, 'code', (node) => {
      makeProperties(node)
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
          const content = tryReadFileSync(
            path.join(MarkdownPath, 'components', `${componentPath}.tsx`),
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

export default remarkCodeConfig
