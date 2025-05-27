import { findAndReplace } from 'mdast-util-find-and-replace'
import { HTMLTextComponentKey, type RemarkPlugin } from '../constant'
import type { AbbrType } from '~/markdown/config/abbr'
import abbrMap from '~/markdown/config/abbr'
import { visit } from 'unist-util-visit'

const AbbrRegx = /\*\[([^\]]+)\]:\s(.*)/g
const remarkAbbrPlugin: RemarkPlugin<[AbbrType]> = (customAbbr) => {
  return (tree) => {
    const map = { ...abbrMap, ...customAbbr }
    visit(tree, 'text', (node, index, parent) => {
      if (index == null || parent == null) {
        return
      }
      const [_, label, title] = AbbrRegx.exec(node.value) ?? []
      if (label && title) {
        map[label] = title
        parent.children.splice(index, 1)
        if (parent.children.length === 0) {
          parent.type = 'root'
        }
      }
    })
    findAndReplace(tree, [
      new RegExp(Object.keys(map).join('|'), 'g'),
      (label) => {
        const data = map[label]
        if (data == null) {
          return false
        }
        return {
          type: 'html',
          value: '<Tooltip  />',
          data: {
            hProperties: {
              label: label,
              title: data,
              [HTMLTextComponentKey]: 'Tooltip',
            },
          },
        }
      },
    ])
  }
}
export default remarkAbbrPlugin
