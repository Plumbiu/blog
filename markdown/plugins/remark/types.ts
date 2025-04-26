import type { Root } from 'mdast'
import type { BuildVisitor } from 'unist-util-visit'

export type Visitor = BuildVisitor<Root, 'inlineCode'>
export type RemarkParent = Parameters<Visitor>[2]