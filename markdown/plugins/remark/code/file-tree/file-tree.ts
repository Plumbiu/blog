import type { Code } from 'mdast'
import {
  FileTreeName,
  handleFileTree,
  handleFileTreeDefaultSelector,
  handleFileTreeDirName,
  handleFileTreeFileIconMapKey,
  handleFileTreeHasPreviewKey,
  handleFileTreeMap,
} from './file-tree-utils'
import { markComponent } from '../../utils'
import {
  CodeTabSplitString,
  handleComponentCodeTitle,
  type RemarkPlugin,
} from '../../../constant'
import { visit } from 'unist-util-visit'
import { parseContent } from './file-tree-node-utils'
import { isString } from '@/lib/types'

const IdRegx = /id=(['"])([^'"]+)\1/
const DirRegx = /dir=(['"])([^'"]+)\1/
const TitleRegx = /title=(['"])([^'"]+)\1/
const remarkFileTreePlugin: RemarkPlugin = () => {
  return async (tree) => {
    const nodes: Code[] = []
    visit(tree, 'code', (node) => {
      if (node.lang === 'Tree') {
        nodes.push(node)
      }
    })
    await Promise.all(
      nodes.map(async (node) => {
        const meta = node.meta || ''
        const code = node.value.trim()
        const id = IdRegx.exec(meta)?.[2]
        const openAll = meta.includes('open')
        const dir = DirRegx.exec(meta)?.[2]
        const parsed = await parseContent(code, openAll, meta, dir, id)
        if (!parsed) {
          return
        }

        const { tree, treeMap, fileIconMap, defaultSelectors } = parsed
        const data = node.data!
        const props = data.hProperties!
        if (dir) {
          handleFileTreeDirName(props, dir)
        }
        handleFileTree(props, JSON.stringify(tree))
        handleFileTreeMap(props, JSON.stringify(treeMap))
        handleFileTreeFileIconMapKey(props, JSON.stringify(fileIconMap))
        handleFileTreeDefaultSelector(props, JSON.stringify(defaultSelectors))
        const title = TitleRegx.exec(meta)?.[2]
        if (title) {
          handleComponentCodeTitle(props, title)
        }
        const hasPreview = !!(id || dir || code.startsWith(CodeTabSplitString))
        handleFileTreeHasPreviewKey(props, hasPreview)
        isString(props.title) && handleComponentCodeTitle(props, props.title)
        markComponent(node, FileTreeName)
      }),
    )
  }
}

export default remarkFileTreePlugin
