import path from 'node:path'
import { visit } from 'unist-util-visit'
import { tryReadFileSync } from '@/utils/node/fs'
import { DataPath } from '@/utils/node/markdown'
import { handlePlaygroundCustomPreivew } from './playground-utils'
import { makeProperties } from '../utils'
import { ComponentLangKey, RemarkPlugin } from '../constant'

const PlaygroundPathRegx = /path=['"]([^'"]+)['"]/
const PlaygroundCustomComponentRegx = /component=['"]([^'"]+)['"]/

const remarkCodeConfig: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const lang = node.lang?.toLowerCase()
      props[ComponentLangKey] = lang
      const meta = node.meta
      if (!meta) {
        return
      }
      const componentName = PlaygroundCustomComponentRegx.exec(meta)?.[1]
      const componentPath = PlaygroundPathRegx.exec(meta)?.[1]
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
