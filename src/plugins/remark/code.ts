import { visit } from 'unist-util-visit'
import { ComponentLangKey, ComponentMetaKey, RemarkReturn } from '../constant'
import { makeProperties } from '../utils'

function remarkCodeConfig(): RemarkReturn {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const meta = node.meta
      const lang = node.lang?.toLowerCase()
      props[ComponentLangKey] = lang
      props[ComponentMetaKey] = meta
    })
  }
}

export default remarkCodeConfig
