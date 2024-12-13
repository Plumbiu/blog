import { visit } from 'unist-util-visit'
import { ComponentLangKey, RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'

const remarkCodeConfig: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      const lang = node.lang?.toLowerCase()
      props[ComponentLangKey] = lang
    })
  }
}

export default remarkCodeConfig
