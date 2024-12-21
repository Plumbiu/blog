import { isArray } from '@/utils/types'
import isPlainObject from 'is-plain-obj'

export function transfromLogValue(value: any) {
  if (isPlainObject(value) || isArray(value)) {
    return JSON.stringify(value)
  }
  return String(value)
}
