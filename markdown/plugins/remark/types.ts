import type { Root } from 'mdast'
import type { BuildVisitor } from 'unist-util-visit'

export type Visitor = BuildVisitor<Root>
export type RemarkParent = Parameters<Visitor>[2]
export type RemarkNode = Parameters<Visitor>[0]