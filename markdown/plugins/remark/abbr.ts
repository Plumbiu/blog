import { findAndReplace } from 'mdast-util-find-and-replace'
import type { RemarkPlugin } from '../constant'
import type { AbbrType } from '~/markdown/config/abbr'
import abbrMap from '~/markdown/config/abbr'

const AbbrRegx = /\|\[([^\]]+)\]\|/g
const remarkAbbrPlugin: RemarkPlugin<[AbbrType]> = (customAbbr) => {
  return (tree) => {
    findAndReplace(tree, [
      AbbrRegx,
      (_, $1) => {
        const data = abbrMap[$1] ?? customAbbr[$1]
        if (data == null) {
          return false
        }
        return {
          type: 'html',
          value: '<Tooltip  />',
          data: {
            hProperties: {
              label: $1,
              title: data,
              __root: true
            }
          }
        }
      },
    ])
  }
}
export default remarkAbbrPlugin
