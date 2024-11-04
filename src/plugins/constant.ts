/// <reference types="mdast-util-directive" />
import { type Root } from 'hast'
import { type Root as RemarkRoot } from 'mdast'
import { buildGetFunction } from './utils'

export const ComponentKey = 'dc'
export const getComponentFromProps = buildGetFunction<string>(ComponentKey)

export type RehypePlugin = (tree: Root) => void
export type RemarkReturn = (tree: RemarkRoot, file: any) => void

export const ComponentCodeKey = `${ComponentKey}code`
export const getCodeFromProps = buildGetFunction<string>(ComponentCodeKey)

export const ComponentMetaKey = `${ComponentKey}meta`
export const getComponentMetaFromProps =
  buildGetFunction<string>(ComponentCodeKey)

export const ComponentLangKey = `${ComponentKey}lang`
export const getLangFromProps = buildGetFunction<string>(ComponentLangKey)
