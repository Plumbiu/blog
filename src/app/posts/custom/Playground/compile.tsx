/* eslint-disable import/no-named-as-default */
import React, { createElement } from 'react'
import clsx from 'clsx'
import { transform, Options } from 'sucrase'

type Scope = Record<string, any>

const baseScope: Scope = {
  react: React,
  React,
  clsx,
  sucrase: {
    transform,
  },
}

const transfromOptions: Options = {
  transforms: ['jsx', 'flow', 'imports'],
}

const baseScopeKeys = Object.keys(baseScope)
const baseScopeValues = Object.values(baseScope)

function evalCode(
  code: string,
  scope = baseScope,
  logMethod?: (value: string) => void,
) {
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
  fn(
    _exports,
    _require,
    {
      log: logMethod || (() => {}),
    },
    ...baseScopeValues,
  )
  return _exports.default
}

function isLikeJSX(p: string) {
  return (
    p.endsWith('.js') ||
    p.endsWith('.jsx') ||
    p.endsWith('.ts') ||
    p.endsWith('.tsx')
  )
}

function getBasename(p: string) {
  if (p.endsWith('.jsx') || p.endsWith('.tsx')) {
    return p.slice(0, p.length - 4)
  }
  if (p.endsWith('.ts') || p.endsWith('.js')) {
    return p.slice(0, p.length - 3)
  }
  return null
}

interface PlaygroundPreviewProps {
  files: Record<string, string>
  defaultSelector: string
  logMethod: (value: any) => void
}

export function PlaygroundPreview({
  files,
  defaultSelector,
  logMethod,
}: PlaygroundPreviewProps) {
  const scope: Scope = {
    ...baseScope,
  }
  function addScope(key: string, value: any) {
    const scopeKey = getBasename(key)
    if (scopeKey) {
      scope['./' + scopeKey] = value
    }
  }
  const main = files[defaultSelector]
  const jsKyes = Object.keys(files).filter((key) => {
    return key !== defaultSelector && isLikeJSX(key)
  })
  const loop = () => {
    for (const key of jsKyes) {
      const code = transform(files[key], transfromOptions).code
      const value = evalCode(code, scope, logMethod)
      addScope(key, value)
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

  const mainCode = transform(main, transfromOptions).code
  return createElement(evalCode(mainCode, scope, logMethod))
}
export function StaticPlaygroundPreview({
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
