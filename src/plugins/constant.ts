/// <reference types="mdast-util-directive" />
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import type { Root as RemarkRoot } from 'mdast'
import { buildHandlerFunction } from './utils'
import { generatePluginKey } from './optimize-utils'

export const ComponentKey = 'component-key-'
export const handleComponentName = buildHandlerFunction<string>(ComponentKey)

export type RehypePlugin<T = undefined> = Plugin<[T], Root>
export type RemarkPlugin<T = undefined> = Plugin<[T], RemarkRoot>

export const ComponentCodeKey = generatePluginKey(`${ComponentKey}code`)
export const handleComponentCode =
  buildHandlerFunction<string>(ComponentCodeKey)

export const ComponentMetaKey = generatePluginKey(`${ComponentKey}meta`)
export const handleComponentMeta =
  buildHandlerFunction<string>(ComponentMetaKey)

export const ComponentLangKey = generatePluginKey(`${ComponentKey}lang`)
export const handleLang = buildHandlerFunction<string>(ComponentLangKey)

export type FileMap = Record<
  string,
  {
    code: string
    meta: string
  }
>
const ComponentFileMapPrefx = generatePluginKey(`${ComponentKey}file-`)
export const FileMapItemKey = generatePluginKey(`${ComponentFileMapPrefx}key`)
export const handleFileMapItemKey = buildHandlerFunction(FileMapItemKey)
export const FileMapKey = generatePluginKey(`${ComponentFileMapPrefx}map`)
export const handleFileMap = buildHandlerFunction<Record<string, string>>(
  FileMapKey,
  JSON.parse,
)
const Selector = 'selector'
export const ComponentSelectorKey = generatePluginKey(
  `${ComponentFileMapPrefx}${Selector}`,
)
export const handleComponentSelectorKey =
  buildHandlerFunction<string>(ComponentSelectorKey)
export const FileMapStartStr = '///'
