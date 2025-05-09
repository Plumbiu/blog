import { findAndReplace } from 'hast-util-find-and-replace'
import type { RehypePlugin } from '../constant'
import type { AbbrType } from '~/markdown/config/abbr'
import abbrMap from '~/markdown/config/abbr'
import { h } from 'hastscript'

const AbbrRegx = /\*\[([^\]]+)\]\[\]/g
const rehypeAbbrPlugin: RehypePlugin<[AbbrType]> = (customAbbr) => {
  return (tree) => {
    findAndReplace(tree, [
      AbbrRegx,
      (_, $1) => {
        const data = abbrMap[$1] ?? customAbbr[$1]
        if (data == null) {
          return false
        }
        return h(
          'span',
          {
            className: 'plumbiu_abbr',
            'data-title': data,
          },
          $1,
        )
      },
    ])
  }
}
export default rehypeAbbrPlugin
