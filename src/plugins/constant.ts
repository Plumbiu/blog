/// <reference types="mdast-util-directive" />
import { type Root } from 'hast'
import { type Root as RemarkRoot } from 'mdast'

export const ComponentKey = 'data-component-'
export function getComponentFromProps(props: any) {
  return props[ComponentKey]
}

export type RehypePlugin = (tree: Root) => void
export type RemarkReturn = (tree: RemarkRoot, file: any) => void

export const ComponentCodeKey = `${ComponentKey}code`
export function getCodeFromProps(props: any): string {
  return props[ComponentCodeKey]
}

export const ComponentMetaKey = `${ComponentKey}meta`
export function getComponentMetaFromProps(props: any): string {
  return props[ComponentCodeKey]
}
