import React from 'react'
import { isJsxFileLike } from '@/lib/shared'
import { keys } from '@/lib/types'

interface Scope {
  _log?: (value: string) => void
  [key: string]: any
}

interface LogFn {
  log: (value: string) => void
}

const baseScope = {
  react: React,
  React,
}

export function getReactComponentByEvalCode(
  code: string,
  scope: Scope = {},
  useBaseScope = false,
) {
  const _require = (k: keyof Scope) => {
    return scope[k]
  }
  const _exports: Record<string, any> = {}
  const scopeKey = keys(useBaseScope ? baseScope : scope)
  const scopeValue = scopeKey.map((key) => scope[key])
  const fn = new Function('exports', 'require', 'console', ...scopeKey, code)

  fn(_exports, _require, { log: scope._log ?? (() => {}) }, ...scopeValue)
  return _exports.default
}

function getJsxLikeBasename(p: string) {
  if (isJsxFileLike(p)) {
    const [basename] = p.split('.')
    return basename
  }
}

interface PlaygroundPreviewProps {
  files: Record<string, string>
  defaultSelector: string
  logFn: LogFn
}

export function renderPlayground({
  files,
  defaultSelector,
  logFn,
}: PlaygroundPreviewProps) {
  const scope: Scope = {
    ...baseScope,
    _log: logFn.log,
  }
  const main = files[defaultSelector]
  const jsKyes = keys(files).filter((key) => {
    return key !== defaultSelector && isJsxFileLike(key)
  })
  const loop = () => {
    for (const key of jsKyes) {
      const value = getReactComponentByEvalCode(files[key], scope, true)
      if (value) {
        const scopeKey = getJsxLikeBasename(key)
        if (scopeKey) {
          scope['./' + scopeKey] = value
        }
      }
    }
  }
  // loop twice for the order
  /**
   * //@tab A.js
   * export default function A() { return '123' }
   * //@tab App.js
   * import A from './A'
   * // ...
   */
  loop()
  loop()

  return getReactComponentByEvalCode(main, scope, true)
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
