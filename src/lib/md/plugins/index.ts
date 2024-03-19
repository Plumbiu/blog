import type { Root, RootContent } from 'hast'

export type NodeType = Root | RootContent

type RewritePlugin = (node: NodeType) => any

export function rewritePlugins(...fns: RewritePlugin[]) {
  return {
    rewrite(node: Root | RootContent) {
      for (const fn of fns) {
        fn(node)
      }
    },
  }
}
