import type { Root } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'
import { get } from 'es-toolkit/compat'
import { toLogValue } from '@/lib/shared'

const VariableRegx = /{{([^}]+)}}/g
function replaceWithVariable(tree: Root, variableMap: Record<string, any>) {
  findAndReplace(tree, [
    VariableRegx,
    (_, $1) => {
      const data = get(variableMap, $1.trim())
      return toLogValue(data)
    },
  ])
}

export default replaceWithVariable
