'use client'

import React, { createElement } from 'react'
import { isJsxFileLike } from '@/lib'
import { keys } from '@/lib/types'

type Scope = Record<string, any>

interface LogFn {
  log: (value: string) => void
}

const baseScope: Scope = {
  react: React,
  React,
}

const baseScopeKeys = keys(baseScope)
const baseScopeValues = baseScopeKeys.map((key) => baseScope[key])

function evalCode(code: string, scope: Scope, logFn?: LogFn) {
  const _require = (k: keyof Scope) => {
    return scope[k]
  }
  const _exports: Record<string, any> = {}
  const fn = new Function(
    'exports',
    'require',
    'console',
    ...baseScopeKeys,
    code,
  )
  fn(_exports, _require, logFn ?? (() => {}), ...baseScopeValues)
  return _exports.default
}

function getJsxLikeBasename(p: string) {
  const [basename, ext] = p.split('.')
  if (ext === 'jsx' || ext === 'tsx' || ext === 'ts' || ext === 'js') {
    return basename
  }
}

interface PlaygroundPreviewProps {
  files: Record<string, string>
  defaultSelector: string
  logFn: LogFn
}

export function renerPlayground({
  files,
  defaultSelector,
  logFn,
}: PlaygroundPreviewProps) {
  const scope: Scope = {
    ...baseScope,
  }
  const main = files[defaultSelector]
  const jsKyes = keys(files).filter((key) => {
    return key !== defaultSelector && isJsxFileLike(key)
  })
  const loop = () => {
    for (const key of jsKyes) {
      const value = evalCode(files[key], scope, logFn)
      const scopeKey = getJsxLikeBasename(key)
      if (scopeKey) {
        scope['./' + scopeKey] = value
      }
    }
  }
  // loop twice for the order
  /**
   * /// A.js
   * export default function A() { return '123' }
   * /// App.js
   * import A from './A'
   * // ...
   */
  loop()
  loop()

  return createElement(evalCode(main, scope, logFn))
}
export function renderStaticPlayground({
  files,
  defaultSelector,
}: PlaygroundPreviewProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: files[defaultSelector],
      }}
    />
  )
}
