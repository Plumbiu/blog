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
export const handleComponentMeta =
  buildHandlerFunction<string>(ComponentMetaKey)

export const ComponentLangKey = `${ComponentKey}lang`
export const handleLang = buildHandlerFunction<string>(ComponentLangKey)

export type FileMap = Record<
  string,
  {
    code: string
    meta: string
  }
>
const ComponentFileMapPrefx = `${ComponentKey}_f`
export const ComponentFileMapKey = `${ComponentFileMapPrefx}key`
export const handleComponentFileKey = buildHandlerFunction(ComponentFileMapKey)
export const ComponentFileMap = `${ComponentFileMapPrefx}m`
export const handleFileMap = buildHandlerFunction<Record<string, string>>(
  ComponentFileMap,
  JSON.parse,
)
const Selector = '_s'
export const ComponentSelectorKey = `${ComponentFileMapPrefx}${Selector}`
export const handleComponentSelectorKey =
  buildHandlerFunction<string>(ComponentSelectorKey)
export const FileMapStartStr = '///'
