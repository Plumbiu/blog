import fsp from 'node:fs/promises'
import path from 'node:path'
import type { Code } from 'mdast'
import { visit } from 'unist-util-visit'
import { tryReadFileSync } from '@/utils/node/fs'
import { DataPath } from '@/utils/node/markdown'
import { handlePlaygroundCustomPreivew } from './code-block/playground-utils'
import { makeProperties } from '../utils'
import type { RemarkPlugin } from '../constant'

const CodePathRegx = /path=(['"])([^'"]+)\1/
const CodeComponentRegx = /component=(['"])([^'"]+)\1/

const remarkCodeConfig: RemarkPlugin = () => {
  return async (tree) => {
    let nodeWithPath: Code | undefined
    let nodePath: string | undefined
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
        nodeWithPath = node
        nodePath = componentPath
        const content = tryReadFileSync(
          path.join(DataPath, 'components', `${componentPath}.tsx`),
        )
        node.value = content.trim()
      }
    })
    if (nodeWithPath && nodePath) {
      const isRemote = nodePath.startsWith('http')
      let content = ''
      if (isRemote) {
        content = await fetch(nodePath).then((res) => res.text())
        nodeWithPath.value = content.trim()
      } else {
        content = await fsp.readFile(
          path.join(DataPath, 'components', `${nodePath}.tsx`),
          'utf-8',
        )
      }
      if (content) {
        nodeWithPath.value = content.trim()
      }
    }
  }
}

export default remarkCodeConfig
