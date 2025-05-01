export function isString(x: unknown): x is string {
  return typeof x === 'string'
}

export function isNumber(x: unknown): x is number {
  return typeof x === 'number'
}

export function isFunction(x: unknown): x is Function {
  return typeof x === 'function'
}

export function isSymbol(x: unknown): x is Symbol {
  return typeof x === 'symbol'
}

export function isObject<T extends Record<string, any>>(x: unknown): x is T {
  return x !== null && typeof x === 'object'
}

export function getType(value: any) {
  const type = Object.prototype.toString.call(value)
  return type.slice(8, type.length - 1)
}

export const isArray = Array.isArray
export const arrayify = <T>(value: T | T[]): T[] =>
  isArray(value) ? value : [value]

export const keys = Object.keys
export const values = Object.values
export const entries = Object.entries
export const assign = Object.assign
