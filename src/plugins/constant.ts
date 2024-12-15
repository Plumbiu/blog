/// <reference types="mdast-util-directive" />
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import type { Root as RemarkRoot } from 'mdast'
import { buildHandlerFunction } from './utils'

export const ComponentKey = 'dc'
export const handleComponentName = buildHandlerFunction<string>(ComponentKey)

export type RehypePlugin<T = undefined> = Plugin<[T], Root>
export type RemarkPlugin<T = undefined> = Plugin<[T], RemarkRoot>

export const ComponentCodeKey = `${ComponentKey}code`
export const handleComponentCode =
  buildHandlerFunction<string>(ComponentCodeKey)

export const ComponentMetaKey = `${ComponentKey}meta`
export const handleComponentMetaFromProps =
  buildHandlerFunction<string>(ComponentMetaKey)

export const ComponentLangKey = `${ComponentKey}lang`
export const handleLangFromProps =
  buildHandlerFunction<string>(ComponentLangKey)
