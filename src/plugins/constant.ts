/// <reference types="mdast-util-directive" />
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import type { Root as RemarkRoot } from 'mdast'
import { buildHandlerFunction } from './utils'
import { generatePluginKey } from './optimize-utils'

export const ComponentKey = generatePluginKey()
export const handleComponentName = buildHandlerFunction<string>(ComponentKey)

export type RehypePlugin<T = undefined> = Plugin<[T], Root>
export type RemarkPlugin<T = undefined> = Plugin<[T], RemarkRoot>

export const ComponentCodeKey = generatePluginKey()
export const handleComponentCode =
  buildHandlerFunction<string>(ComponentCodeKey)

export const ComponentMetaKey = generatePluginKey()
export const handleComponentMeta =
  buildHandlerFunction<string>(ComponentMetaKey)

export const ComponentLangKey = generatePluginKey()
export const handleLang = buildHandlerFunction<string>(ComponentLangKey)

export type FileMap = Record<
  string,
  {
    code: string
    meta: string
  }
>
const ComponentFileMapPrefx = generatePluginKey()
export const FileMapItemKey = generatePluginKey()
export const handleFileMapItemKey = buildHandlerFunction(FileMapItemKey)
export const FileMapKey = generatePluginKey()
export const handleFileMap = buildHandlerFunction<Record<string, string>>(
  FileMapKey,
  JSON.parse,
)
const Selector = 'selector'
export const ComponentSelectorKey = generatePluginKey()
export const handleComponentSelectorKey =
  buildHandlerFunction<string>(ComponentSelectorKey)
export const FileMapStartStr = '///'
