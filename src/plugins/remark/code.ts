import path from 'node:path'
import { visit } from 'unist-util-visit'
import { tryReadFileSync } from '@/utils/node/fs'
import { DataPath } from '@/utils/node/markdown'
import { handlePlaygroundCustomPreivew } from './playground-utils'
import { makeProperties } from '../utils'
import { RemarkPlugin } from '../constant'

const CodePathRegx = /path=['"]([^'"]+)['"]/
const CodeComponentRegx = /component=['"]([^'"]+)['"]/

const remarkCodeConfig: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const meta = node.meta
      if (!meta) {
        return
      }
      const componentName = CodeComponentRegx.exec(meta)?.[1]
      const componentPath = CodePathRegx.exec(meta)?.[1]
      if (componentName) {
        handlePlaygroundCustomPreivew(props, componentName)
      }
      if (componentPath) {
        const content = tryReadFileSync(
          path.join(DataPath, 'components', `${componentPath}.tsx`),
        )
        node.value = content.trim()
      }
    })
  }
}

export default remarkCodeConfig
