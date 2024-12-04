type ClassNameArg = any
export function cn(...args: ClassNameArg[]) {
  let classname = ''
  for (const arg of args) {
    if (!arg) {
      continue
    }
    if (typeof arg === 'object') {
      for (const key in arg) {
        const value = arg[key]
        if (value) {
          classname += ' ' + key
        }
      }
    } else {
      classname += ' ' + arg
    }
  }

  return classname ? classname.slice(1) : undefined
}
