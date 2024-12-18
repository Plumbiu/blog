import isPlainObject from 'is-plain-obj'

export function transfromLogValue(value: any) {
  if (isPlainObject(value) || Array.isArray(value)) {
    return JSON.stringify(value)
  }
  return String(value)
}
