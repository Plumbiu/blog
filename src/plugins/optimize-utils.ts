let i = 0
// xxxName should not use this
export function generatePluginKey(devName: string) {
  if (process.env.NODE_ENV === 'development') {
    return devName
  }
  return 'a' + i++
}
