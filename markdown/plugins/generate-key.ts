let i = 0
// xxxName should not use this
/*@__PURE__*/
export const generatePluginKey =
  process.env.NODE_ENV === 'development'
    ? (devName: string) => devName
    : () => 'a' + i++
