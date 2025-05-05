import {
  FileTreeName,
  handleFileTree,
  handleFileTreeMap,
} from './file-tree-utils'
import { markComponent } from '../../utils'
import { isString } from '@/lib/types'
import type { RemarkPlugin } from '../../../constant'
import { visit } from 'unist-util-visit'
import { parseContent } from './file-tree-node-utils'
/**
- markdown
  - plugins
    - remark.ts
    - rehype.ts
  - utils.ts
- package.json
- .gitignore
 */

const FileTreeIdRegx = /id=(['"])([^'"]+)\1/
const remarkFileTreePlugin: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      const meta = node.meta
      const code = node.value
      if (meta && node.lang === 'FileTree') {
        const id = FileTreeIdRegx.exec(meta)?.[2]
        if (!isString(id)) {
          return
        }
        const parsed = parseContent(code, id)
        if (!parsed) {
          return
        }
        const { tree, treeMap } = parsed
        const data = node.data!
        const props = data.hProperties!
        handleFileTree(props, JSON.stringify(tree))
        handleFileTreeMap(props, JSON.stringify(treeMap))
        markComponent(node, FileTreeName)
      }
    })
  }
}

export default remarkFileTreePlugin
