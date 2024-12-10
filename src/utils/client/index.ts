import { isNumber, isString } from '../types'

type ClassNameArg = any
export function cn(...args: ClassNameArg[]) {
  let classname = ''
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (isString(arg) || isNumber(arg)) {
      classname && (classname += ' ')
      classname += arg
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) {
          classname && (classname += ' ')
          classname += key
        }
      }
    }
  }

  return classname
}

export function throttle(fn: Function, wait = 300) {
  let start = Date.now()
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - start < wait) {
      return
    }
    start = now

    fn.apply(this, args)
  }
}

export function debounce(fn: Function, wait = 300) {
  let timer: any = null

  return function (this: any, ...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}
