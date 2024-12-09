import { visit } from 'unist-util-visit'
import { ComponentLangKey, ComponentMetaKey, RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'

const remarkCodeConfig: RemarkPlugin = () => {
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
