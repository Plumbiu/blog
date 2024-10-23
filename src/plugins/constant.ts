/// <reference types="mdast-util-directive" />
import { type Root } from 'hast'
import { type Root as RemarkRoot } from 'mdast'

export const ComponentKey = 'data-component'
export function getComponentFromProps(props: any) {
  return props[ComponentKey]
}

export type RehypePlugin = (tree: Root) => void
export type RemarkReturn = (tree: RemarkRoot, file: any) => void
