/// <reference types="mdast-util-directive" />
import { type Root } from 'hast'
import { type Plugin } from 'unified'
import { type Root as RemarkRoot } from 'mdast'
import { buildPlaygroundHandlerFunction } from './utils'

export const ComponentKey = 'dc'
export const handleComponentName =
  buildPlaygroundHandlerFunction<string>(ComponentKey)

export type RehypePlugin<T extends unknown = undefined> = Plugin<[T], Root>
export type RemarkPlugin<T extends unknown = undefined> = Plugin<
  [T],
  RemarkRoot
>

export const ComponentCodeKey = `${ComponentKey}code`
export const handleComponentCode =
  buildPlaygroundHandlerFunction<string>(ComponentCodeKey)

export const ComponentMetaKey = `${ComponentKey}meta`
export const handleComponentMetaFromProps =
  buildPlaygroundHandlerFunction<string>(ComponentMetaKey)

export const ComponentLangKey = `${ComponentKey}lang`
export const handleLangFromProps =
  buildPlaygroundHandlerFunction<string>(ComponentLangKey)
