import { visit } from 'unist-util-visit'
import type { Text, InlineCode } from 'mdast'
import injectVariable from './variable'
import injectEmoji from './emoji'
import type { RemarkPlugin } from '../../constant'

export const remarkPlainText: RemarkPlugin<string> = (code: string) => {
  function handler(node: Text | InlineCode) {
    injectVariable(node, code)
    injectEmoji(node, code)
  }

  return (tree) => {
    visit(tree, 'text', handler)
    visit(tree, 'inlineCode', handler)
  }
}
