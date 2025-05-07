/// <reference types="mdast-util-directive" />
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import type { Root as RemarkRoot } from 'mdast'
import { buildHandlerFunction } from './utils'

export const ComponentKey = 'cmp-key'
export const handleComponentName = buildHandlerFunction<string>(ComponentKey)

export type RehypePlugin<T extends unknown[] = []> = Plugin<T, Root>
export type RemarkPlugin<T extends unknown[] = []> = Plugin<T, RemarkRoot>

export const ComponentCodeKey = 'cmp-code'
export const handleComponentCode =
  buildHandlerFunction<string>(ComponentCodeKey)

export const ComponentMetaKey = 'cmp-meta'
export const handleComponentMeta =
  buildHandlerFunction<string>(ComponentMetaKey)

export const ComponentLangKey = 'cmp-lang'
export const handleLang = buildHandlerFunction<string>(ComponentLangKey)

export const ComponentPropsKey = 'cmp-props'
export const handleComponentProps = buildHandlerFunction<
  Record<string, string>
>(ComponentPropsKey, JSON.parse)

export type FileMap = Record<
  string,
  {
    code: string
    meta: string
  }
>
const ComponentFileMapPrefx = 'cmp-file-'
export const FileMapItemKey = `${ComponentFileMapPrefx}key`
export const handleFileMapItemKey = buildHandlerFunction<string>(FileMapItemKey)
export const FileMapKey = `${ComponentFileMapPrefx}map`
export const handleFileMap = buildHandlerFunction<Record<string, string>>(
  FileMapKey,
  JSON.parse,
)
export const ComponentDefaultSelectorKey = `${ComponentFileMapPrefx}selector`
export const handleComponentDefaultSelectorKey = buildHandlerFunction<string>(
  ComponentDefaultSelectorKey,
)
export const FileMapStartStr = '///'

export const ComponentCodeTitle = 'cmp-code-title'
export const handleComponentCodeTitle =
  buildHandlerFunction<string>(ComponentCodeTitle)
