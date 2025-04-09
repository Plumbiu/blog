import { isArray } from '@/lib/types'
import isPlainObject from 'is-plain-obj'

export function transfromLogValue(value: any) {
  if (isPlainObject(value) || isArray(value)) {
    return JSON.stringify(value)
  }
  return String(value)
}
